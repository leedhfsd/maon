package com.easter.member.domain.member.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SaveFcmTokenRequestDto {
    private String fcmToken;
}