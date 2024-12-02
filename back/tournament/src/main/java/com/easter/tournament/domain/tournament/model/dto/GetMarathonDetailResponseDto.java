package com.easter.tournament.domain.tournament.model.dto;

import com.easter.tournament.domain.team.model.dto.TeamMemberDto;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetMarathonDetailResponseDto {
    private UUID uuid;
    private String title;
    private String location;
    private String host;
    private String homepage;
    private LocalDateTime receiptStart;
    private LocalDateTime receiptEnd;
    private LocalDateTime tournamentDayStart;
    private LocalDateTime tournamentDayEnd;
    private Double latitude;
    private Double longitude;
    private String inquiry;
    private String imageUrl;
    private boolean closed;

    private List<String> categories;
    private boolean bookmarked;

    private boolean participated;
    private boolean hasTeam;
    private UUID teamId;
    private List<TeamMemberDto> teamMembers;
}
