package com.easter.tournament.domain.team.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberDto {
    private UUID id;
    private String name;
    private String nickname;
    private String email;
    private String imageUrl;
}
