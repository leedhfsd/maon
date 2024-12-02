package com.easter.route.domain.marathonRoute.domain.dto;

import java.time.LocalDateTime;
import java.util.HashMap;

import org.springframework.data.mongodb.core.geo.GeoJsonLineString;
import org.springframework.data.mongodb.core.geo.GeoJsonMultiPoint;

import com.easter.route.domain.marathonRoute.domain.entity.MarathonRoute;
import com.easter.route.domain.route.entity.enums.SpecialPointType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarathonRouteDto {
	private String routeId;
	private String writerId;
	private String writerName;
	private String routeName;
	private String recordType;
	private String startPoint;
	private Double distance;
	private GeoJsonLineString track;
	private LocalDateTime createdAt;
	private HashMap<SpecialPointType, GeoJsonMultiPoint> specialPoint;

	public static MarathonRouteDto of(MarathonRoute route) {
		return MarathonRouteDto.builder() // Builder 호출 수정
			.routeId(route.getId()) // routeId와 엔티티의 getId()를 매칭
			.writerId(route.getWriterId())
			.writerName(route.getWriterName())
			.routeName(route.getRouteName())
			.startPoint(route.getStartPoint())
			.distance(route.getDistance())
			.track(route.getTrack())
			.createdAt(route.getCreatedAt())
			.specialPoint(route.getSpecialPoint())
			.createdAt(route.getCreatedAt())
			.build();
	}
}
