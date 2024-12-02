package com.easter.route.domain.route.entity.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateRouteRequestDto {
	private String routeName;
	private String recordId;
}
