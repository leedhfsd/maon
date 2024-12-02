package com.easter.member.domain.member.model.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CheckRedundancyRequestDto {
    private String nickname;
}
