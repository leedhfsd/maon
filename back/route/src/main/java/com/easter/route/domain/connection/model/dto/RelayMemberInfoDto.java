package com.easter.route.domain.connection.model.dto;

import com.easter.route.domain.connection.model.ConnectionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RelayMemberInfoDto {
    private ConnectionType type;
    private UUID memberId;
    private LocalDateTime timestamp;
}
