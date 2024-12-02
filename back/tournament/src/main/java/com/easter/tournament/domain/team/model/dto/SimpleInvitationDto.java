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
public class SimpleInvitationDto {
    private UUID invitationId;
    private String nickname;
    private String imageUrl;
    private String teamName;
    private String tournamentName;
}
