package com.easter.route.domain.record.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PointPair {
	private Double startLatitude;
	private Double startLongitude;
	private Double endLatitude;
	private Double endLongitude;
}
