package com.easter.tournament.domain.team.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchTeamMemberResponseDto {
    private List<TeamMemberDto> teamMemberList;
}
