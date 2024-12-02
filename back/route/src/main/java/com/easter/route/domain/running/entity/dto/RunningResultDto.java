package com.easter.route.domain.running.entity.dto;

import com.easter.route.domain.record.entity.dto.RecordDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RunningResultDto {
    private RecordDto record;
    private Double routeDistance;
    private String status;
}
