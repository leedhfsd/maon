package com.easter.member.domain.member.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class UpdateMemberRequestDto {
    private String name;
    private String phoneNumber;
    private String birthDate;
    private String address;
    private Integer height;
    private Integer weight;
    private MultipartFile profileImage;
}
