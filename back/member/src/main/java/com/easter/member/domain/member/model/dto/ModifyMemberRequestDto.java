package com.easter.member.domain.member.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ModifyMemberRequestDto {
    private String name;
    private String phoneNumber;
    private String birthDate;
    private String height;
    private String weight;
}
