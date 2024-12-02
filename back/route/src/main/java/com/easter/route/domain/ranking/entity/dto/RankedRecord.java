package com.easter.route.domain.ranking.entity.dto;

import com.easter.route.domain.record.entity.Record;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RankedRecord {
    private String memberId;
    private String memberNickname;
    private String memberProfileUrl;
    private String recordId;
    private String runningTime;
    private String averagePace;

    public static RankedRecord of(Record record) {
        return RankedRecord.builder()
                .memberId(record.getMemberId())
                .recordId(record.getId())
                .runningTime(record.getRunningTime())
                .averagePace(record.getAveragePace())
                .build();
    }

    public void updateMemberInfo(String memberNickname, String memberProfileUrl) {
        this.memberNickname = memberNickname;
        this.memberProfileUrl = memberProfileUrl;
    }
}
