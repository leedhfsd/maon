package com.easter.route.domain.record.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.easter.route.domain.record.entity.dto.CreateRunningResponseDto;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.easter.route.domain.record.entity.Record;
import com.easter.route.domain.record.entity.dto.CreateRunningRequestDto;
import com.easter.route.domain.record.entity.dto.GetMyRecordsResponseDto;
import com.easter.route.domain.record.entity.dto.RecordDto;
import com.easter.route.domain.record.entity.dto.UpdateRecordDto;
import com.easter.route.domain.record.entity.enums.RecordType;
import com.easter.route.domain.record.repository.RecordRepository;
import com.easter.route.domain.route.entity.Route;
import com.easter.route.domain.route.repository.RouteRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class RecordServiceImpl implements RecordService {

	private final RecordRepository recordRepository;
	private final RouteRepository routeRepository;
	private final MongoTemplate mongoTemplate;

	@Override
	public CreateRunningResponseDto createRunning(UUID memberId, CreateRunningRequestDto createRunningRequestDto) {
		Record record = Record.builder()
			.memberId(String.valueOf(memberId))
			.recordType(RecordType.valueOf(createRunningRequestDto.getRecordType()))
			.completed(false)
			.runningTime("00:00:00")
			.averagePace("00'00\"")
			.averageHeartRate(0)
			.distance(0)
			.createdAt(LocalDateTime.now())
			.routeId(createRunningRequestDto.getRouteId())
			.build();
		log.error("레코드: {}", record);

		Record savedRecord = recordRepository.save(record);
		String id = savedRecord.getId();
		return CreateRunningResponseDto.builder()
				.recordId(id)
				.memberId(memberId)
				.build();
	}

	@Override
	public Record updateRecord(UpdateRecordDto updateRecordDto) {
		Record record = recordRepository.findById(updateRecordDto.getRecordId())
			.orElseThrow(() -> new IllegalArgumentException("Record not found"));
		record.updateRecord(updateRecordDto);
		return recordRepository.save(record);
	}

	@Override
	public List<GetMyRecordsResponseDto> getRecordListByMemberId(String memberId) {
		Query query = new Query(Criteria.where("memberId").is(memberId));
		query.with(Sort.by(Sort.Direction.DESC, "createdAt"));
		List<Record> records = mongoTemplate.find(query, Record.class);
		List<GetMyRecordsResponseDto> myRecords = records.stream().map(GetMyRecordsResponseDto::of).toList();
		myRecords.forEach(record -> {
			if (record.getRouteId() == null) {
				return;
			}
			Optional<Route> route = routeRepository.findById(record.getRouteId());
			if (route == null) {
				return;
			}
			record.setRouteDistance(route.get().getDistance());
			record.setRouteName(route.get().getRouteName());
		});
		return myRecords;
	}
}
