package com.easter.route.domain.ranking.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GetRankingListDto {
    private String routeId;
    private List<RankedRecordDto> rankingInfo;
    private LocalDateTime updatedAt;
}
