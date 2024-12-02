package com.easter.member.domain.member.model.dto;

import com.easter.member.domain.member.model.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetMemberInfoResponseDto {
    private String nickname;
    private int height;
    private int weight;
    private String name;
    private String phoneNumber;
    private String email;
    private String address;
    private String birthDate;
    private Gender gender;
    private String imageUrl;
}
