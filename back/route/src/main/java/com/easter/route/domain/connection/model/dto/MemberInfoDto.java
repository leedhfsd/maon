package com.easter.route.domain.connection.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@NoArgsConstructor
public class MemberInfoDto {
    private UUID memberId;
    private String memberNickname;
    private LocalDateTime timestamp;
}
