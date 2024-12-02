package com.easter.route.domain.connection.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class HeartRateDto {
    private Integer heartRate;
    private String time;
}
