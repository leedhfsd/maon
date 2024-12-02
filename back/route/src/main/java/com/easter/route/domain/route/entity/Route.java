package com.easter.route.domain.route.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.geo.GeoJsonLineString;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "route")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Route {
    @Id
    private String id;

    @Field("writer_id")
    private String writerId;

    @Field("writer_name")
    private String writerName;

    @Field("route_name")
    private String routeName;

    @Field("start_point")
    private String startPoint;

    private Double distance;

    private GeoJsonLineString track;

    @CreatedDate
    private LocalDateTime createdAt;
}
