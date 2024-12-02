package com.easter.route.domain.running.entity.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RouteValidationResult {
	// 경로를 이탈하지 않았다면 false, 경로를 이탈했다면 true;
	private boolean isOnRoute;
	// 끝점 판단
	private boolean isEndPoint;
	// 다음에 사용할 루트의 index
	private int nextRouteIndex;
	// 다음 인덱스까지의 거리
	private double distanceToNextRouteIndex;
}
