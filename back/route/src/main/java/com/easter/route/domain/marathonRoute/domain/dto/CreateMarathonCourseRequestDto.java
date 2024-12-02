package com.easter.route.domain.marathonRoute.domain.dto;

import java.time.LocalDateTime;
import java.util.HashMap;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.geo.GeoJsonLineString;
import org.springframework.data.mongodb.core.geo.GeoJsonMultiPoint;
import org.springframework.web.multipart.MultipartFile;

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
public class CreateMarathonCourseRequestDto {
	private String writerId;
	private String writerName;
	private String routeName;
	private String startPoint;
	private Double distance;
	private GeoJsonLineString track;
	private HashMap<SpecialPointType, GeoJsonMultiPoint> specialPoint;

	public MarathonRoute toEntity() {
		return MarathonRoute.builder()
			.writerId(writerId)
			.writerName(writerName)
			.routeName(routeName)
			.startPoint(startPoint)
			.distance(distance)
			.track(track)
			.specialPoint(specialPoint)
			.createdAt(LocalDateTime.now())
			.build();
	}

}
