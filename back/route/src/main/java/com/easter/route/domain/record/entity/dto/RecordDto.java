package com.easter.route.domain.record.entity.dto;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.core.geo.GeoJsonLineString;

import com.easter.route.domain.record.entity.Record;
import com.easter.route.domain.record.entity.enums.RecordType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecordDto {
	private String id;
	private String routeId;
	private List<String> paceList;
	private List<Double> distanceList;
	private String startPoint;
	private GeoJsonLineString recordedTrack;
	private String runningTime;
	private String averagePace;
	private int averageHeartRate;
	private double distance;
	private LocalDateTime createdAt;

	public static RecordDto of(Record record) {
		return RecordDto.builder()
			.id(record.getId())
			.routeId(record.getRouteId())
			.paceList(record.getPaceList())
			.distanceList(record.getDistanceList())
			.startPoint(record.getStartPoint())
			.recordedTrack(record.getRecordedTrack())
			.runningTime(record.getRunningTime())
			.averagePace(record.getAveragePace())
			.averageHeartRate(record.getAverageHeartRate())
			.distance(record.getDistance())
			.createdAt(record.getCreatedAt())
			.build();
	}
}
