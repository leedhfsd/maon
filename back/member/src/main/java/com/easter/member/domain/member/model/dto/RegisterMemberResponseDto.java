package com.easter.member.domain.member.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterMemberResponseDto {
    private UUID id;
    private String name;
    private String email;
    private String accessToken;
    private String refreshToken;
    private String imageUrl;
}
