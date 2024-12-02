package com.easter.tournament.domain.tournament.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@NoArgsConstructor
public class BookmarkRequestDto {
    private UUID tournamentId;
}
