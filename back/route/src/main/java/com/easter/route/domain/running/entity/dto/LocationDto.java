package com.easter.route.domain.running.entity.dto;

import org.springframework.data.geo.Point;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LocationDto {
	private String memberId;
	private String routeId;
	private String recordId;
	private String latitude;
	private String longitude;
	private double runningDistance;
	private int heartRate;
	private String pace;
	private String time;
	private int routeIndex;

	public Point getPoint() {
		return new Point(Double.parseDouble(latitude), Double.parseDouble(longitude));
	}
}
