package com.easter.route.domain.ranking.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GetMyRankingDto {
    private String routeId;
    private String recordId;
    private String memberId;
    private String memberNickname;
    private String memberProfileUrl;
    private int ranking;
    private String runningTime;
    private String averagePace;
}
