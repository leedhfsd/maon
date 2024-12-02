package com.easter.tournament.domain.participant.model.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ParticipantRequestDto {
    private String tournamentCategory;
    private UUID tournamentId;
    private long teamId;
}
