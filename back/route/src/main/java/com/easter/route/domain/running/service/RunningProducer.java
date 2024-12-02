package com.easter.route.domain.running.service;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.easter.route.domain.record.entity.dto.PointPair;
import com.easter.route.domain.running.entity.dto.LocationDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class RunningProducer {

	private final KafkaTemplate<String, LocationDto> kafkaLocationTemplate;
    private final KafkaTemplate<String, PointPair> kafkaPointPairTemplate;

    public void findStartPoint(PointPair pointPair) {
        String topic = "route.running.find-start-point";
        kafkaPointPairTemplate.send(topic, pointPair)
            .whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("Failed to send location data: {}", pointPair, ex);
                } else {
                    log.info("Sending location data to topic: {}, data: {}", topic, pointPair);
                }
            });
    }

    public void sendLocation(LocationDto locationDto) {
        String topic = "route.running.process-location";
        kafkaLocationTemplate.send(topic, locationDto.getRecordId(), locationDto)
            .whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("Failed to send location data: {}", locationDto, ex);
                } else {
                    log.info("Sending location data to topic: {}, key: {}, data: {}", topic, locationDto.getRecordId(), locationDto);
                }
            });
    }

    public void sendLocationWithRoute(LocationDto locationDto) {
        String topic = "route.running.process-location-with-route";
        kafkaLocationTemplate.send(topic, locationDto.getRecordId(), locationDto)
            .whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("Failed to send location data: {}", locationDto, ex);
                } else {
                    log.info("Sending location data to topic: {}, key: {}, data: {}", topic, locationDto.getRecordId(), locationDto);
                }
            });
    }

    public void sendTeamLocation(String teamId, LocationDto locationDto) {
        String topic = "route.running.process-team-location";
        kafkaLocationTemplate.send(topic, teamId, locationDto)
            .whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("Failed to send location data: {}", locationDto, ex);
                } else {
                    log.info("Sending location data to topic: {}, key: {}, data: {}", topic, teamId, locationDto);
                }
            });
    }

}
