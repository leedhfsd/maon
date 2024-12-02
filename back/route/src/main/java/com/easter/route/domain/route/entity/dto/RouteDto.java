package com.easter.route.domain.route.entity.dto;

import com.easter.route.domain.route.entity.Route;
import com.easter.route.domain.route.entity.enums.SpecialPointType;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.mongodb.core.geo.GeoJsonLineString;
import org.springframework.data.mongodb.core.geo.GeoJsonMultiPoint;

import java.time.LocalDateTime;
import java.util.HashMap;

@Data
@Builder
public class RouteDto {
    private String routeId;
    private String writerId;
    private String writerName;
    private String routeName;
    private String startPoint;
    private Double distance;
    private GeoJsonLineString track;
    private String routeImageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static RouteDto of(Route route) {
        return RouteDto.builder()
                .routeId(route.getId())
                .writerId(route.getWriterId())
                .writerName(route.getWriterName())
                .routeName(route.getRouteName())
                .startPoint(route.getStartPoint())
                .distance(route.getDistance())
                .track(route.getTrack())
                .createdAt(route.getCreatedAt())
                .build();
    }
}
