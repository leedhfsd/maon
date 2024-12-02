package com.easter.tournament.domain.tournament.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MyTournament {
    private UUID id;
    private String title;
    private LocalDateTime tournamentDayStart;
    private LocalDateTime tournamentDayEnd;
    private String tournamentCategory;
    private String location;
    private double longitude;
    private double latitude;
    private String imageUrl;
}
