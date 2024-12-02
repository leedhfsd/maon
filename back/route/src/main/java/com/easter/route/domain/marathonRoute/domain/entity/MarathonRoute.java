package com.easter.route.domain.marathonRoute.domain.entity;

import java.time.LocalDateTime;
import java.util.HashMap;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonLineString;
import org.springframework.data.mongodb.core.geo.GeoJsonMultiPoint;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.easter.route.domain.route.entity.Route;
import com.easter.route.domain.route.entity.enums.SpecialPointType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "marathon_route")
@Builder
public class MarathonRoute{

	@Id
	private String id;

	@Field("writer_id")
	private String writerId;

	@Field("writer_name")
	private String writerName;

	@Field("route_name")
	private String routeName;

	@Field("start_point")
	private String startPoint;

	private Double distance;

	private GeoJsonLineString track;

	@CreatedDate
	private LocalDateTime createdAt;

	@Field("special_point")
	private HashMap<SpecialPointType, GeoJsonMultiPoint> specialPoint = new HashMap<>();
}
