package com.easter.route.domain.route.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.easter.route.domain.marathonRoute.domain.dto.MarathonRouteDto;
import com.easter.route.domain.marathonRoute.domain.entity.MarathonRoute;
import com.easter.route.domain.marathonRoute.repository.MarathonRouteRepository;
import com.easter.route.domain.ranking.entity.Ranking;
import com.easter.route.domain.ranking.repository.RankingRepository;
import com.easter.route.domain.record.entity.Record;
import com.easter.route.domain.record.entity.dto.GetRouteDetailsRequestDto;
import com.easter.route.domain.record.repository.RecordRepository;
import com.easter.route.domain.route.entity.Route;
import com.easter.route.domain.route.entity.dto.*;
import com.easter.route.domain.route.repository.RouteRepository;
import com.easter.route.global.exception.BusinessException;
import com.easter.route.global.security.PassportDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestAttribute;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class RouteServiceImpl implements RouteService {
	private final RouteRepository routeRepository;
	private final RecordRepository recordRepository;
	private final RankingRepository rankingRepository;
	private final MongoTemplate mongoTemplate;

	@Override
	public void createRoute(PassportDto passport, CreateRouteRequestDto createRouteRequestDto) {
		Record record = recordRepository.findById(createRouteRequestDto.getRecordId())
				.orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "레코드를 찾을 수 없습니다."));

		Route route = Route.builder()
				.writerId(passport.getId().toString())
				.writerName(passport.getNickname())
				.routeName(createRouteRequestDto.getRouteName())
				.startPoint(record.getStartPoint())
				.distance(record.getDistance())
				.track(record.getRecordedTrack())
				.createdAt(LocalDateTime.now())
				.build();

		routeRepository.save(route);
		rankingRepository.save(Ranking.builder()
				.routeId(route.getId())
				.rankedRecords(new ArrayList<>())
				.build());
	}

	@Override
	public void deleteRoute(PassportDto passport, DeleteRouteRequestDto deleteRouteRequestDto) {
		Route findRoute = routeRepository.findById(deleteRouteRequestDto.getRouteId())
				.orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "경로를 찾을 수 없습니다."));
		if (!findRoute.getWriterId().equals(passport.getId().toString())) {
			throw new BusinessException(HttpStatus.FORBIDDEN, "경로를 삭제할 권한이 없습니다.");
		}
		routeRepository.deleteById(findRoute.getId());
	}

	@Override
	public List<RouteDto> getRouteList() {
		Query query = new Query();
		query.with(Sort.by(Sort.Direction.DESC, "createdAt"));
		List<Route> routeList = mongoTemplate.find(query, Route.class);
		return routeList.stream().map(RouteDto::of).toList();
	}

	@Override
	public List<?> searchRouteByConditions(PassportDto passport, GetRouteDetailsRequestDto getRouteDetailsRequestDto) {
		if (getRouteDetailsRequestDto.getRouteType() == null) {
			return getRouteList();
		}
		double distance = getRouteDetailsRequestDto.getRouteDistance() != null ? getRouteDetailsRequestDto.getRouteDistance() : Double.MAX_VALUE;
		String keyword = getRouteDetailsRequestDto.getKeyword() != null ? getRouteDetailsRequestDto.getKeyword() : "";
		Criteria criteria = new Criteria();
		criteria.and("distance").lte(distance);
		if (keyword != null && !keyword.trim().isEmpty()) {
			criteria.orOperator(
				Criteria.where("routeName").regex(keyword, "i"),
				Criteria.where("startPoint").regex(keyword, "i"),
				Criteria.where("writerName").regex(keyword, "i")
			);
		}

		Query query;
		switch (getRouteDetailsRequestDto.getRouteType()) {
			case "MARATHON":
				query = new Query(criteria);
				return mongoTemplate.find(query, MarathonRoute.class);
			case "ROUTE":
				query = new Query(criteria);
				return mongoTemplate.find(query, Route.class);
			case "MY":
				criteria.and("writerId").is(passport.getId().toString());
				query = new Query(criteria);
				List<Route> myRoutes = mongoTemplate.find(query, Route.class);
				List<MarathonRoute> myMarathonRoutes = mongoTemplate.find(query, MarathonRoute.class);
				List<Object> combinedResults = new ArrayList<>();
				combinedResults.addAll(myRoutes.stream().map(RouteDto::of).toList());
				combinedResults.addAll(myMarathonRoutes.stream().map(MarathonRouteDto::of).toList());
				return combinedResults;
			default:
				return getRouteList();
		}
	}
}
