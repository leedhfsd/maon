package com.easter.route.domain.connection.model.dto;

import com.easter.route.domain.connection.model.ConnectionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WatchConnectDto {
    private ConnectionType type;
    private LocalDateTime timestamp;
}
