package com.easter.route.domain.marathonRoute.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeleteMarathonCourseRequestDto {
	private String marathonRouteId;
}
