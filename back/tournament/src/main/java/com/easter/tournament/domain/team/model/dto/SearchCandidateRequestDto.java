package com.easter.tournament.domain.team.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@NoArgsConstructor
public class SearchCandidateRequestDto {
    private UUID teamId;
    private String keyword;
}
