package com.easter.route.domain.ranking.entity;

import com.easter.route.domain.ranking.entity.dto.RankedRecord;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "ranking")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
public class Ranking {
    @Id
    private String id;

    @Field("route_id")
    private String routeId;

    @Field("ranked_records")
    private List<RankedRecord> rankedRecords;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public void updateRankingRecords(List<RankedRecord> rankedRecords) {
        this.rankedRecords = rankedRecords;
    }
}
