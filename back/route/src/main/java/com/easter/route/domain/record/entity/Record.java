package com.easter.route.domain.record.entity;

import com.easter.route.domain.running.entity.dto.LocationDto;
import com.easter.route.domain.record.entity.dto.UpdateRecordDto;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonLineString;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.easter.route.domain.record.entity.enums.RecordType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "records")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@ToString
public class Record {
	@Id
	private String id;

	@Field("member_id")
	private String memberId;

	@Field("route_id")
	private String routeId;

	@Field("completed")
	private boolean completed;

	@Field("running_info")
	@Builder.Default
	private List<LocationDto> runningInfo = new ArrayList<>();

	@Field("pace_list")
	@Builder.Default
	private List<String> paceList = new ArrayList<>();

	@Field("distance_list")
	@Builder.Default
	private List<Double> distanceList = new ArrayList<>();

	@Field("recorded_track")
	private GeoJsonLineString recordedTrack;

	@Field("running_time")
	private String runningTime;

	@Field("average_pace")
	private String averagePace;

	@Field("average_heart_rate")
	private int averageHeartRate;

	@Field("distance")
	private double distance;

	@Field("record_type")
	private RecordType recordType;

	@Field("start_point")
	private String startPoint;

	@CreatedDate
	private LocalDateTime createdAt;

	public void updateCompleted() {
		this.completed = true;
	}

	public void updateRecord(UpdateRecordDto updateRecordDto) {
		this.id = updateRecordDto.getRecordId();
		this.runningInfo = updateRecordDto.getRunningInfo();
		this.paceList = updateRecordDto.getPaceList();
		this.distanceList = updateRecordDto.getDistanceList();
		this.averageHeartRate = updateRecordDto.getAverageHeartRate();
		this.distance = updateRecordDto.getDistance();
		this.recordedTrack = updateRecordDto.getRecordedTrack();
		this.runningTime = updateRecordDto.getRunningTime();
		this.averagePace = updateRecordDto.getAveragePace();
		this.startPoint = updateRecordDto.getStartPoint();
		this.completed = updateRecordDto.getCompleted();
	}
}
