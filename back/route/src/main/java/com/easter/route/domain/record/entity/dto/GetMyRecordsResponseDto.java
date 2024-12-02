package com.easter.route.domain.record.entity.dto;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.core.geo.GeoJsonLineString;

import com.easter.route.domain.record.entity.Record;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GetMyRecordsResponseDto {
	private String id;
	private List<String> paceList;
	private List<Double> distanceList;
	private String startPoint;
	private GeoJsonLineString recordedTrack;
	private String runningTime;
	private String averagePace;
	private int averageHeartRate;
	private double distance;
	private LocalDateTime createdAt;
	private String routeId;
	private String routeName;
	private Double routeDistance;

	public static GetMyRecordsResponseDto of(Record recordDto) {
		return GetMyRecordsResponseDto.builder()
			.id(recordDto.getId())
			.paceList(recordDto.getPaceList())
			.distanceList(recordDto.getDistanceList())
			.startPoint(recordDto.getStartPoint())
			.recordedTrack(recordDto.getRecordedTrack())
			.runningTime(recordDto.getRunningTime())
			.averagePace(recordDto.getAveragePace())
			.averageHeartRate(recordDto.getAverageHeartRate())
			.distance(recordDto.getDistance())
			.createdAt(recordDto.getCreatedAt())
			.build();
	}
}
