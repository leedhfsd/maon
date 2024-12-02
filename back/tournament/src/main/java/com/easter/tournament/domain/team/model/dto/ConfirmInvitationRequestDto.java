package com.easter.tournament.domain.team.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@NoArgsConstructor
public class ConfirmInvitationRequestDto {
    private UUID invitationId;
    private boolean accept;
}
