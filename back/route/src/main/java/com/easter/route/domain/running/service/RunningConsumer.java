package com.easter.route.domain.running.service;

import java.time.Duration;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import com.easter.route.domain.record.entity.Record;
import com.easter.route.domain.record.entity.dto.CreateRunningRequestDto;
import com.easter.route.domain.record.entity.dto.CreateRunningResponseDto;
import com.easter.route.domain.running.entity.dto.GroupRunningSession;
import com.easter.route.domain.running.entity.dto.LocationDto;

import com.easter.route.domain.record.entity.dto.RecordDto;
import com.easter.route.domain.running.entity.dto.RouteValidationResult;
import com.easter.route.domain.running.entity.dto.RunningResultDto;
import com.easter.route.domain.record.entity.dto.UpdateRecordDto;
import com.easter.route.domain.record.repository.RecordRepository;
import com.easter.route.domain.record.service.RecordService;
import com.easter.route.domain.route.entity.Route;
import com.easter.route.domain.route.repository.RouteRepository;
import com.easter.route.global.exception.BusinessException;
import com.easter.route.global.utils.DistanceCalculator;
import com.easter.route.global.utils.GoogleGeoCoding;
import com.easter.route.global.utils.PaceCalculator;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.geo.GeoJsonLineString;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class RunningConsumer {

	// Kafka recordId를 key로 메시지가 쌓이고, 그 값은 Map에 저장된다.
	// 발생할 수 있는 동시성 이슈들
	// 1. 동일 recordId에 대해 동시 업데이트가 발생하는 경우(같은 사용자의 정보가 서로 다른 카프카 파티션에서 처리될 때)
	// 2. 위치 정보 리스트에서 동시에 여러 데이터가 추가 되는 경우
	// 3. 심박수 계산 시 Race Condition
	// 4. Map 초기화와 동시에 접근할 때

	private final RecordService recordService;
	private final RecordRepository recordRepository;
	private final RouteRepository routeRepository;
	private final RunningValidationService runningValidationService;
	private final GoogleGeoCoding GoogleGeoCoding;
	private final ConcurrentHashMap<String, List<LocationDto>> runningInfoMap= new ConcurrentHashMap<>();
	private final ConcurrentHashMap<String, GroupRunningSession> groupRunningInfoMap = new ConcurrentHashMap<>();
	private final SimpMessagingTemplate messagingTemplate;
	
	// 경로 없이 뛰기
	@KafkaListener(topics = "route.running.process-location", groupId = "running.process.location", containerFactory = "locationKafkaListenerContainerFactory")
	public void listenLocation(LocationDto locationDto, Acknowledgment acknowledgment) {
		try {
			log.info("Received location data in listener: {}", locationDto);
			String recordId = locationDto.getRecordId();
			runningInfoMap.computeIfAbsent(recordId, k -> new ArrayList<>()).add(locationDto);
			acknowledgment.acknowledge();
		} catch (Exception e) {
			log.error("Failed to acknowledge message: {}", locationDto, e);
		}
	}

	//혼자 경로 있이 뛰기 (경로 이탈 판정, 마지막 인덱스 시 끝점 판단)
	@KafkaListener(topics = "route.running.process-location-with-route", groupId = "running.process.location-with-route", containerFactory = "locationKafkaListenerContainerFactory")
	public void listenLocationWithRoute(LocationDto locationDto, Acknowledgment acknowledgment) {
		try {
			log.info("Received location data in listener: {}", locationDto);
			String recordId = locationDto.getRecordId();
			runningInfoMap.computeIfAbsent(recordId, k -> new ArrayList<>()).add(locationDto);
			RouteValidationResult result = validateLocation(locationDto);
			String destination = "/sub/running/route/" + recordId;
			messagingTemplate.convertAndSend(destination, result);
			acknowledgment.acknowledge();
		} catch (Exception e) {
			log.error("Failed to acknowledge message: {}", locationDto, e);
		}
	}

	// 팀으로 뛰기 (경로 이탈  판정, 마지막 인덱스 시 끝점 판단)
	@KafkaListener(topics = "route.running.process-team-location", groupId = "running.process.team-location", containerFactory = "locationKafkaListenerContainerFactory")
	public void listenTeamLocation(String teamId, LocationDto locationDto, Acknowledgment acknowledgment) {
		try {
			log.info("Received location teamId: {}, location: {}", teamId, locationDto);
			groupRunningInfoMap.computeIfAbsent(teamId, k -> GroupRunningSession.builder()
				.runningInfoMap(new ConcurrentHashMap<>())
				.build());
			if (locationDto.getRecordId() == null) {
				CreateRunningResponseDto result =
					recordService.createRunning(UUID.fromString(locationDto.getMemberId()),
						new CreateRunningRequestDto(locationDto.getRouteId(), "RACE"));
				locationDto.setRecordId(result.getRecordId());
				groupRunningInfoMap.get(teamId).getRunningInfoMap().put(String.valueOf(result.getMemberId()), new ArrayList<>()).add(locationDto);
			}
			if (groupRunningInfoMap.get(teamId).getRunningInfoMap().containsKey(locationDto.getMemberId())) {
				groupRunningInfoMap.get(teamId).getRunningInfoMap().get(locationDto.getMemberId()).add(locationDto);
			}
			messagingTemplate.convertAndSend("/sub/running/team/" + teamId, groupRunningInfoMap.get(teamId).getRunningInfoMap());
			RouteValidationResult result = validateLocation(locationDto);
			String destination = "/sub/running/team/" + locationDto.getMemberId();
			messagingTemplate.convertAndSend(destination, result);
			acknowledgment.acknowledge();
		} catch (Exception e) {
			log.error("Failed to acknowledge. teamId: {}, message: {}", teamId, locationDto, e);
		}
	}


	public RouteValidationResult validateLocation(LocationDto locationDto) {
		return runningValidationService.makeRouteValidationResult(locationDto);
	}

	// 러닝 종료시 결과 값 계산 후 엔티티에 저장한다.
	public Record calculateResult(Record record, ConcurrentHashMap<String, List<LocationDto>> runningInfoMap) {
		String recordId = record.getId();
		// 시간 순서로 정렬
		runningInfoMap.get(recordId).sort((a, b) -> a.getTime().compareTo(b.getTime()));
		// 계산
		List<LocationDto> list = getRunningInfo(recordId, runningInfoMap);
		List<String> paceList = getPaceList(recordId, runningInfoMap);
		List<Double> distanceList = getDistanceList(recordId, runningInfoMap);
		int averageHeartRate = getAverageHeartRate(recordId, runningInfoMap);
		GeoJsonLineString recordedTrack = getRecordedTrack(recordId, runningInfoMap);
		String runningTime = list.size() > 1 ? list.get(list.size() - 1).getTime() : "00:00:00";
		double distance = !list.isEmpty() ? list.get(list.size() - 1).getRunningDistance() : 0;
		String averagePace = PaceCalculator.calculateAveragePace(paceList);

		boolean isCompleted = false;
		String startPoint;
		Optional<Route> route = routeRepository.findById(record.getRouteId());

		if (route.isPresent()) {
			log.info("route_id: {} 를 찾았습니다.", route.get().getId());
			Route findRoute = route.get();
			List<Point> coordinates =  findRoute.getTrack().getCoordinates();
			Point endPoint = coordinates.get(coordinates.size() - 1);
			// 사용자가 달린 거리가 등록된 경로의 총 길이 이상이고, 도착지점과 10m 이내라면 완주로 처리한다.
			if (DistanceCalculator.isWithinDistance(
				endPoint.getX(),
				endPoint.getY(),
				Double.parseDouble(list.get(list.size() - 1).getLatitude()),
				Double.parseDouble(list.get(list.size() - 1).getLongitude()),
				5)) {
				isCompleted = true;
			}
			startPoint = findRoute.getStartPoint();
		} else {
			log.info("등록된 경로가 없습니다.");
			startPoint = GoogleGeoCoding.getAddress(Double.parseDouble(list.get(0).getLatitude()), Double.parseDouble(list.get(0).getLongitude()));
		}

		UpdateRecordDto updateRecordDto = UpdateRecordDto.builder()
			.recordId(recordId)
			.runningInfo(list)
			.paceList(paceList)
			.distanceList(distanceList)
			.averageHeartRate(averageHeartRate)
			.distance(distance)
			.averagePace(averagePace)
			.recordedTrack(recordedTrack)
			.runningTime(runningTime)
			.completed(isCompleted)
			.startPoint(startPoint)
			.build();

		Record updatedRecord = recordService.updateRecord(updateRecordDto);
		return updatedRecord;
	}

	// 러닝 종료시 계산한 값을 클라이언트에 반환한다.
	public RunningResultDto finish(String recordId) {
		// Record 조회 및 검증
		Record record = recordRepository.findById(recordId)
			.orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND,
				"레코드가 존재하지 않습니다: recordId = " + recordId));
		log.info("Record: {} 를 찾았습니다.", record);
		// Record 결과 계산
		Record updatedRecord = calculateResult(record, runningInfoMap);
		double routeDistance = Optional.ofNullable(updatedRecord.getRouteId())
			.flatMap(routeRepository::findById)
			.map(Route::getDistance)
			.orElseGet(updatedRecord::getDistance);
		return new RunningResultDto(RecordDto.of(updatedRecord), routeDistance, "end");
	}

	// 러닝 종료시 계산한 값을 클라이언트에 반환한다.
	public RunningResultDto finishTeam(String teamId, String memberId) {
		GroupRunningSession groupRunningSession = groupRunningInfoMap.get(teamId);
		String recordId = groupRunningSession.getRunningInfoMap().get(memberId).get(0).getRecordId();
		Record record = recordRepository.findById(recordId)
			.orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND,
				"레코드가 존재하지 않습니다: recordId = " + recordId));
		log.info("Record: {} 를 찾았습니다.", record);
		// Record 결과 계산
		Record updatedRecord = calculateResult(record, groupRunningSession.getRunningInfoMap());
		double routeDistance = Optional.ofNullable(updatedRecord.getRouteId())
			.flatMap(routeRepository::findById)
			.map(Route::getDistance)
			.orElseGet(updatedRecord::getDistance);
		return new RunningResultDto(RecordDto.of(updatedRecord), routeDistance, "end");
	}


	public List<LocationDto> getRunningInfo(String recordId, ConcurrentHashMap<String, List<LocationDto>> runningInfoMap) {
		return runningInfoMap.getOrDefault(recordId, new ArrayList<>());
	}

	public void clearRunningInfo(String recordId) {
		runningInfoMap.remove(recordId);
	}

	public void clearRunningInfo(String teamId, String recordId) {
		groupRunningInfoMap.get(teamId).getRunningInfoMap().remove(recordId);
	}

	public List<String> getPaceList(String recordId, ConcurrentHashMap<String, List<LocationDto>> runningInfoMap) {
		List<LocationDto> list = getRunningInfo(recordId, runningInfoMap);
		return list.stream().map(LocationDto::getPace).toList();
	}

	public List<Double> getDistanceList(String recordId, ConcurrentHashMap<String, List<LocationDto>> runningInfoMap) {
		List<LocationDto> list = getRunningInfo(recordId, runningInfoMap);
		return list.stream().map(LocationDto::getRunningDistance).toList();
	}

	public int getAverageHeartRate(String recordId, ConcurrentHashMap<String, List<LocationDto>> runningInfoMap) {
		List<LocationDto> list = getRunningInfo(recordId, runningInfoMap);
		return list.stream().mapToInt(LocationDto::getHeartRate).sum() / list.size();
	}

	public GeoJsonLineString getRecordedTrack(String recordId, ConcurrentHashMap<String, List<LocationDto>> runningInfoMap) {
		List<LocationDto> list = getRunningInfo(recordId, runningInfoMap);
		return new GeoJsonLineString(list.stream().map(LocationDto::getPoint).toList());
	}

	public String timeDifference(String startTime, String endTime) {
		LocalTime start = LocalTime.parse(startTime);
		LocalTime end = LocalTime.parse(endTime);

		Duration duration = Duration.between(start, end);
		long hours = duration.toHours();
		long minutes = duration.toMinutesPart();
		long seconds = duration.toSecondsPart();

		return String.format("%02d:%02d:%02d", hours, minutes, seconds);
	}
}
