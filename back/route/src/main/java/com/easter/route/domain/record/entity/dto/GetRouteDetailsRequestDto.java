package com.easter.route.domain.record.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetRouteDetailsRequestDto {
	private Double routeDistance;
	private String routeType;
	private String keyword;
}
