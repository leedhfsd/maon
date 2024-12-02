package com.easter.tournament.domain.team.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@NoArgsConstructor
public class CancelInvitationRequestDto {
    private UUID inviteeId;
    private UUID teamId;
}
