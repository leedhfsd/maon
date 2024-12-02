package com.easter.route.domain.ranking.service;

import java.util.*;

import com.easter.route.domain.ranking.entity.Ranking;
import com.easter.route.domain.ranking.entity.dto.*;
import com.easter.route.domain.record.entity.Record;
import com.easter.route.domain.route.entity.Route;
import com.easter.route.domain.route.entity.dto.GetMemberListRequestFeignDto;
import com.easter.route.domain.route.entity.dto.GetMemberListResponseFeignDto;
import com.easter.route.domain.route.entity.dto.MemberInfo;
import com.easter.route.domain.route.service.MemberClient;
import com.easter.route.global.exception.BusinessException;
import com.easter.route.global.response.ResultResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.easter.route.domain.ranking.repository.RankingRepository;

import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.client.RestClient;

@RequiredArgsConstructor
@Service
@Slf4j
public class RankingServiceImpl implements RankingService {

	@Value("${external-url.member}")
	private String memberUrl;

	private final RankingRepository rankingRepository;
	private final MongoTemplate mongoTemplate;
	private final MemberClient memberClient;
	private final ObjectMapper objectMapper;
	private final RestClient restClient;

	@Override
	public GetRankingListDto getRankingList(String routeId) {
		Ranking ranking = rankingRepository.findByRouteId(routeId)
				.orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "랭킹 정보가 없습니다."));

		return GetRankingListDto.builder()
			.routeId(routeId)
			.updatedAt(ranking.getUpdatedAt())
			.rankingInfo(ranking.getRankedRecords().stream().map(RankedRecordDto::of).toList())
			.updatedAt(ranking.getUpdatedAt())
			.build();
	}

	@Override
	public GetMyRankingDto getMyRanking(String routeId, String memberId) {
		Ranking ranking = rankingRepository.findById(routeId)
				.orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "해당 경로의 랭킹 정보가 없습니다."));

		int myRank = 0;
		RankedRecord myRecord = null;
		for (int i = 0; i < ranking.getRankedRecords().size(); i++) {
			if (ranking.getRankedRecords().get(i).getMemberId().equals(memberId)) {
				myRank = i + 1;
				myRecord = ranking.getRankedRecords().get(i);
				break;
			}
		}

		if (myRecord == null) {
			throw new BusinessException(HttpStatus.NOT_FOUND, "해당 회원의 랭킹 정보가 없습니다.");
		}

		return GetMyRankingDto.builder()
			.routeId(routeId)
			.recordId(myRecord.getRecordId())
			.memberId(memberId)
			.memberNickname(myRecord.getMemberNickname())
			.memberProfileUrl(myRecord.getMemberProfileUrl())
			.recordId(myRecord.getRecordId())
			.ranking(myRank)
			.build();
	}


	// Spring Scheduler로 오전 00:00에 랭킹리스트가 업데이트 된다.
	@Override
	@Scheduled(cron = "0 0 15 * * *")
	public void updateAllRankingList() {
		List<Ranking> rankings = rankingRepository.findAll();
		log.info("랭킹 수: {}", rankings.size());
		for(int i = 0; i < rankings.size(); i++) {
			log.info("랭킹 {}/{}", i + 1, rankings.get(i).getRouteId());
		}
		rankings.forEach(this::updateRanking);
	}

	public void updateRanking(Ranking ranking) {
		log.info("랭킹을 업데이트합니다. routeId: {}", ranking.getRouteId());
		String routeId = ranking.getRouteId();
		Query query = new Query(Criteria.where("routeId").is(routeId).and("completed").is(true));
		List<Record> findRecords = mongoTemplate.find(query, Record.class);
		log.info("기록 수: {}", findRecords.size());
		List<RankedRecord> rankedRecords = findRecords.stream()
				.map(RankedRecord::of)
				.sorted((a, b) -> a.getRunningTime().compareTo(b.getRunningTime()))
				.toList();

		// 멤버 정보 가져오기
		List<UUID> memberIds = rankedRecords.stream().map((rankedRecord -> UUID.fromString(rankedRecord.getMemberId()))).toList();
		log.info("멤버 수: {}", memberIds.size());
//		GetMemberListRequestFeignDto getMemberListRequestFeignDto = GetMemberListRequestFeignDto.builder().idList(memberIds).build();
		List<MemberInfo> memberList = getMemberInfo(memberIds, null).getMemberInfoList();

//		ResponseEntity<ResultResponse> res = memberClient.getMemberInfoList(getMemberListRequestFeignDto);
//		log.info("res: {}", res);
//		if (res.getStatusCode() != HttpStatus.OK) {
//			throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "멤버 서비스에서 정보를 가져오는데 실패했습니다.");
//		}
		// 멤버 정보 최신화
//		List<MemberInfo> memberList =
//				objectMapper.convertValue(Objects.requireNonNull(res.getBody()).getData(), GetMemberListResponseFeignDto.class).getMemberInfoList();
		for (int i = 0; i < memberList.size(); i++) {
			log.info("멤버 {}", memberList.get(i).toString());
		}
		log.info("멤버 정보 수: {}", memberList.size());
		MemberInfo memberInfo;
		for (int i = 0; i < rankedRecords.size(); i++) {
			memberInfo = memberList.get(i);
			rankedRecords.get(i).updateMemberInfo(memberInfo.getNickname(), memberInfo.getImageUrl());
		}

		// 랭킹 업데이트
		ranking.updateRankingRecords(rankedRecords);
		rankingRepository.save(ranking);
	}

	public void createRankingsForAllRoutes() {
		log.info("모든 루트의 랭킹을 생성합니다.");
		// MongoTemplate으로 모든 route_id 가져오기
		List<String> allRouteIds = mongoTemplate.query(Route.class)
			.distinct("_id")
			.as(ObjectId.class) // 먼저 ObjectId로 받기
			.all()
			.stream()
			.map(ObjectId::toString) // ObjectId를 String으로 변환
			.toList();

		// 모든 route_id를 확인하여 Ranking 생성
		allRouteIds.forEach(routeId -> {
			rankingRepository.findByRouteId(routeId)
				.orElseGet(() -> {
					// Ranking이 없는 경우 새로 생성
					Ranking newRanking = Ranking.builder()
						.routeId(routeId)
						.rankedRecords(new ArrayList<>())
						.build();
					return rankingRepository.save(newRanking);
				});
		});
	}

	public void feignTest() {
		// List<UUID> memberIds = new ArrayList<>();
		// GetMemberListRequestFeignDto getMemberListRequestFeignDto = GetMemberListRequestFeignDto.builder().idList(memberIds).build();
		// ResponseEntity<ResultResponse> res = memberClient.getMemberInfoList(getMemberListRequestFeignDto);
		// if (res.getStatusCode() != HttpStatus.OK) {
		// 	throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "멤버 서비스에서 정보를 가져오는데 실패했습니다.");
		// }
		// // 멤버 정보 최신화
		// List<MemberInfo> memberList =
		// 	objectMapper.convertValue(Objects.requireNonNull(res.getBody()).getData(), GetMemberListResponseFeignDto.class).getMemberInfoList();
		try {
			List<UUID> memberIds = new ArrayList<>();
			GetMemberListRequestFeignDto getMemberListRequestFeignDto = GetMemberListRequestFeignDto.builder()
				.idList(memberIds)
				.build();

			log.info("Feign request DTO: {}", getMemberListRequestFeignDto); // 요청 데이터 로깅

			ResponseEntity<ResultResponse> res = memberClient.getMemberInfoList(getMemberListRequestFeignDto);
			log.info("Feign response status: {}", res.getStatusCode()); // 응답 상태 로깅

			if (res.getStatusCode() != HttpStatus.OK) {
				log.error("Failed to get member info. Status: {}, Body: {}",
					res.getStatusCode(),
					res.getBody()); // 실패 시 응답 바디까지 로깅

				throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR,
					String.format("멤버 서비스에서 정보를 가져오는데 실패했습니다. Status: %s", res.getStatusCode()));
			}

			// 멤버 정보 최신화
			ResultResponse resultResponse = res.getBody();
			if (resultResponse == null || resultResponse.getData() == null) {
				log.error("Response body or data is null");
				throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "멤버 서비스 응답이 올바르지 않습니다.");
			}

			try {
				GetMemberListResponseFeignDto responseDto = objectMapper.convertValue(
					resultResponse.getData(),
					GetMemberListResponseFeignDto.class
				);
				List<MemberInfo> memberList = responseDto.getMemberInfoList();
				log.info("Successfully retrieved {} members", memberList.size()); // 성공 시 결과 개수 로깅

			} catch (IllegalArgumentException e) {
				log.error("Failed to convert response data: {}", e.getMessage(), e);
				throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "멤버 정보 변환에 실패했습니다.");
			}
		} catch (FeignException e) {
			log.error("Feign client error occurred: status={}, message={}",
				e.status(),
				e.getMessage(),
				e); // Feign 예외 상세 정보 로깅
			throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR,
				String.format("멤버 서비스 호출 중 오류가 발생했습니다: %s", e.getMessage()));
		} catch (Exception e) {
			log.error("Unexpected error during member service call: {}", e.getMessage(), e);
			throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR,
				"멤버 서비스 호출 중 예상치 못한 오류가 발생했습니다.");
		}
	}

	private GetMemberListResponseFeignDto getMemberInfo(List<UUID> memberIdList, String nicknameKeyword) {
		if(memberIdList == null || memberIdList.size() == 0) {
			return GetMemberListResponseFeignDto.builder().memberInfoList(new ArrayList<>()).build();
		}
		ResponseEntity<Map> memberResponse = restClient.post().uri(memberUrl + "/service/search").contentType(MediaType.APPLICATION_JSON)
				.body(GetMemberListRequestFeignDto.builder().idList(memberIdList).nicknameKeyword(nicknameKeyword).build())
				.retrieve()
				.onStatus(HttpStatusCode::is4xxClientError, (request, response) -> {
					throw new BusinessException(HttpStatus.BAD_REQUEST, "멤버 서비스와 통신 실패");
				})
				.onStatus(HttpStatusCode::is5xxServerError, (request, response) -> {
					throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "멤버 서비스와 통신 실패");
				})
				.toEntity(Map.class);
		return objectMapper.convertValue(memberResponse.getBody().get("data"), GetMemberListResponseFeignDto.class);
	}
}