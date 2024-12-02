package com.easter.tournament.domain.tournament.model.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class SearchMyTournamentResponseDto {
    private List<MyTournament> tournamentList;
}
