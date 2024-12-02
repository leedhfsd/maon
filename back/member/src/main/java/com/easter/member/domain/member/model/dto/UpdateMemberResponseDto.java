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
public class UpdateMemberResponseDto {
    private String name;
    private String phoneNumber;
    private String birthDate;
    private int height;
    private int weight;
    private String address;
    private String accessToken;
    private String imageUrl;
}
