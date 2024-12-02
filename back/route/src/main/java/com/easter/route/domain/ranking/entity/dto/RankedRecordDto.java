package com.easter.route.domain.ranking.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RankedRecordDto {
    private String memberId;
    private String recordId;
    private String memberNickname;
    private String memberProfileUrl;
    private String runningTime;
    private String averagePace;

    public static RankedRecordDto of(RankedRecord rankedRecord) {
        return RankedRecordDto.builder()
                .memberId(rankedRecord.getMemberId())
                .recordId(rankedRecord.getRecordId())
                .memberNickname(rankedRecord.getMemberNickname())
                .memberProfileUrl(rankedRecord.getMemberProfileUrl())
                .runningTime(rankedRecord.getRunningTime())
                .averagePace(rankedRecord.getAveragePace())
                .build();
    }
}
