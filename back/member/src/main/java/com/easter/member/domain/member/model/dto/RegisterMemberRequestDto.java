package com.easter.member.domain.member.model.dto;

import com.easter.member.domain.member.model.Gender;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterMemberRequestDto {
    private String name;
    private String nickname;
    private String email;
    private Integer height;
    private Integer weight;
    private String birthDate;
    private String address;
    private Gender gender;
    private MultipartFile profileImage;
    private String phoneNumber;
}
