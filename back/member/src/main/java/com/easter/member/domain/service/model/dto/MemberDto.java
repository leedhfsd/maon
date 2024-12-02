package com.easter.member.domain.service.model.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class MemberDto {
    private UUID id;
    private String name;
    private String nickname;
    private String email;
    private String imageUrl;
}
