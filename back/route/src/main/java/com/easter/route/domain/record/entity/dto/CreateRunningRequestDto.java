package com.easter.route.domain.record.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateRunningRequestDto {
	private String routeId;
	private String recordType;
}
