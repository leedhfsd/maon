package com.easter.route.domain.running.service;

import java.util.List;

import org.springframework.data.geo.Point;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.easter.route.domain.route.entity.Route;
import com.easter.route.domain.route.repository.RouteRepository;
import com.easter.route.domain.running.entity.dto.LocationDto;
import com.easter.route.domain.running.entity.dto.RouteValidationResult;
import com.easter.route.global.exception.BusinessException;
import com.easter.route.global.utils.DistanceCalculator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RunningValidationServiceImpl implements RunningValidationService {
	private final RouteRepository routeRepository;
	private static final double MAX_ALLOWED_DEVIATION = 5.0;

	private static class DistanceResult {
		private boolean isOnRoute;
		private boolean isEndPoint;
		private int nextRouteIndex;
		private double distanceToNextRouteIndex;
	}

	@Override
	public RouteValidationResult makeRouteValidationResult(LocationDto locationDto) {
		if (locationDto.getRouteId() == null) {
			throw new BusinessException(HttpStatus.NOT_FOUND, "경로가 있어야 합니다.");
		}
		Route route = routeRepository.findById(locationDto.getRouteId())
			.orElseThrow(() -> new IllegalArgumentException("경로가 존재하지 않습니다."));
		List<Point> coordinates = route.getTrack().getCoordinates();

		DistanceResult distanceResult = calculateDistances(locationDto, coordinates);

		return RouteValidationResult.builder()
			.isOnRoute(distanceResult.isOnRoute)
			.isEndPoint(distanceResult.isEndPoint)
			.nextRouteIndex(distanceResult.nextRouteIndex)
			.distanceToNextRouteIndex(distanceResult.distanceToNextRouteIndex)
			.build();
	}

	// 경로 계산
	private DistanceResult calculateDistances(LocationDto locationDto, List<Point> coordinates) {
		DistanceResult result = new DistanceResult();
		// Validate input to prevent potential index out of bounds
		int currentIndex = locationDto.getRouteIndex();
		if (currentIndex < 0 || currentIndex >= coordinates.size()) {
			result.isOnRoute = false;
			result.nextRouteIndex = -1;
			result.distanceToNextRouteIndex = Double.MAX_VALUE; // 유효하지 않은 값으로 초기화
			result.isEndPoint = false;
			return result;
		}
		// 현재 위치 가져오기
		Point current = new Point(
			Double.parseDouble(locationDto.getLatitude()),
			Double.parseDouble(locationDto.getLongitude())
		);
		Point currentIndexPoint = coordinates.get(currentIndex);
		// 현재 경로점과의 거리 계산
		double currentDist = DistanceCalculator.calculateDistance(
			currentIndexPoint.getX(), currentIndexPoint.getY(),
			current.getX(), current.getY()
		);
		// 초기 상태 설정
		result.isOnRoute = currentDist <= MAX_ALLOWED_DEVIATION;
		result.nextRouteIndex = currentIndex;
		result.distanceToNextRouteIndex = currentDist;
		// 다음 경로점 확인
		for (int nextIndex = currentIndex + 1; nextIndex < coordinates.size(); nextIndex++) {
			Point nextIndexPoint = coordinates.get(nextIndex);
			double nextDist = DistanceCalculator.calculateDistance(
				current.getX(), current.getY(),
				nextIndexPoint.getX(), nextIndexPoint.getY()
			);
			if (nextDist > MAX_ALLOWED_DEVIATION) {
				break; // 경로를 벗어난 경우 루프 종료
			}
			// 경로 위에 있을 경우 상태 업데이트
			result.isOnRoute = true;
			result.nextRouteIndex = nextIndex;
			result.distanceToNextRouteIndex = nextDist;
		}
		// 마지막 경로점 도달 여부 확인
		Point endPoint = coordinates.get(coordinates.size() - 1); // 중복 호출 제거
		result.isEndPoint = DistanceCalculator.isWithinDistance(
			endPoint.getX(), endPoint.getY(),
			current.getX(), current.getY(),
			MAX_ALLOWED_DEVIATION
		);
		return result;
	}

	// // 경로 이탈 로직
	// public boolean validateOnRoute(LocationDto locationDto) {
	// 	if (locationDto.getRouteId() == null) {
	// 		throw new BusinessException(HttpStatus.NOT_FOUND, "경로가 있어야 합니다.");
	// 	}
	// 	Route route = routeRepository.findById(locationDto.getRouteId())
	// 		.orElseThrow(() -> new IllegalArgumentException("경로가 존재하지 않습니다."));
	//
	// 	List<Point> coordinates = route.getTrack().getCoordinates();
	// 	Point currentIndexPoint = coordinates.get(locationDto.getRouteIndex());
	// 	Point current = new Point(Double.parseDouble(locationDto.getLatitude()), Double.parseDouble(locationDto.getLongitude()));
	//
	// 	double currentDist = DistanceCalculator.calculateDistance(currentIndexPoint.getX(), currentIndexPoint.getY(), current.getX(), current.getY());
	//
	// 	int nextIndex = locationDto.getRouteIndex() + 1;
	// 	if (nextIndex >= coordinates.size()) {
	// 		throw new BusinessException(HttpStatus.BAD_REQUEST, "경로가 끝났습니다.");
	// 	}
	//
	// 	Point nextIndexPoint;
	// 	boolean isWithinDistance = false;
	//
	// 	if (currentDist <= MAX_ALLOWED_DEVIATION) {
	// 		isWithinDistance = true;
	// 	}
	//
	// 	double nextDist = 0;
	// 	while (nextIndex < coordinates.size()) {
	// 		nextIndexPoint = coordinates.get(nextIndex);
	// 		nextDist = DistanceCalculator.calculateDistance(current.getX(), current.getY(), nextIndexPoint.getX(), nextIndexPoint.getY());
	// 		if (nextDist > MAX_ALLOWED_DEVIATION) {
	// 			break;
	// 		}
	// 		isWithinDistance = true;
	// 		nextIndex++;
	// 	}
	// 	return isWithinDistance;
	// }
	
	// 끝점 판단 로직
	// @Override
	// public boolean validateIsEndPoint(LocationDto locationDto) {
	// 	if (locationDto.getRouteId() == null) {
	// 		throw new BusinessException(HttpStatus.NOT_FOUND, "경로가 있어야 합니다.");
	// 	}
	// 	Route route = routeRepository.findById(locationDto.getRouteId())
	// 		.orElseThrow(() -> new IllegalArgumentException("경로가 존재하지 않습니다."));
	// 	List<Point> coordinates = route.getTrack().getCoordinates();
	// 	Point endPoint = coordinates.get(coordinates.size() - 1);
	// 	if (DistanceCalculator.isWithinDistance(
	// 		endPoint.getX(),
	// 		endPoint.getY(),
	// 		Double.parseDouble(locationDto.getLatitude()),
	// 		Double.parseDouble(locationDto.getLongitude()),
	// 		MAX_ALLOWED_DEVIATION)) {
	// 		return true;
	// 	}
	// 	return false;
	// }
}
