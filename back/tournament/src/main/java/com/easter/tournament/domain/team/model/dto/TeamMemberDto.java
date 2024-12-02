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
public class TeamMemberDto {
    private UUID id;
    private String name;
    private String nickname;
    private String email;
    private String imageUrl;
    private boolean confirmed; // 이 멤버가 확정 멤버인지를 출력
}
