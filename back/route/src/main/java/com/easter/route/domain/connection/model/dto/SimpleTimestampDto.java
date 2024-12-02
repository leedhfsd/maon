package com.easter.route.domain.connection.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class SimpleTimestampDto {
    private LocalDateTime timestamp;
}
