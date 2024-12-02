package com.easter.route.domain.running.controller;

import com.easter.route.domain.record.entity.Record;
import com.easter.route.domain.record.entity.dto.PointPair;
import com.easter.route.domain.record.repository.RecordRepository;
import com.easter.route.domain.running.entity.dto.LocationDto;
import com.easter.route.domain.running.entity.dto.RouteValidationResult;
import com.easter.route.domain.running.entity.dto.RunningResultDto;
import com.easter.route.domain.running.service.RunningConsumer;
import com.easter.route.domain.running.service.RunningProducer;
import com.easter.route.global.utils.DistanceCalculator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class RunningStompController {
    private final RunningProducer runningProducer;
    private final RunningConsumer runningConsumer;
    private final SimpMessageSendingOperations messagingTemplate;
    private final RecordRepository recordRepository;

    // 시작점 판정
    @MessageMapping("/running/{memberId}/find-start-point")
    @SendTo("/sub/running/{memberId}/find-start-point")
    public boolean findStartPoint(@DestinationVariable String memberId, PointPair pointPair) {
        log.info("Received memberId: {}, start point request: {}",memberId ,pointPair);
        return DistanceCalculator.isWithinDistance(
            pointPair.getStartLatitude(),
            pointPair.getStartLongitude(),
            pointPair.getEndLatitude(),
            pointPair.getEndLongitude(),
            10);
    }

    @MessageMapping("/running/{recordId}")
    @SendTo("/sub/running/{recordId}")
    public LocationDto sendLocation(@DestinationVariable String recordId, LocationDto locationDto) {
        log.info("Received location data without route: {}", recordId);
        log.info("Received location data without route: {}", locationDto);
        runningProducer.sendLocation(locationDto);
        return locationDto;
    }

    @MessageMapping("/running/route/{recordId}")
    public void sendLocationWithRoute(@DestinationVariable String recordId, LocationDto locationDto) {
        log.info("Received location data with route: {}", recordId);
        log.info("Received location data with route: {}", locationDto);
        runningProducer.sendLocationWithRoute(locationDto);
    }

    @MessageMapping("/running/team/{teamId}")
    public void sendTeamLocation(@DestinationVariable String teamId, LocationDto locationDto) {
        log.info("Received team location data: {}", teamId);
        log.info("Received team location data: {}", locationDto);
        runningProducer.sendTeamLocation(teamId, locationDto);
    }

    @MessageMapping("/running/{recordId}/end")
    @SendTo("/sub/running/{recordId}/end")
    public RunningResultDto finish(@DestinationVariable String recordId) {
        log.info("End record request received: {}", recordId);
        try {
            RunningResultDto result = runningConsumer.finish(recordId);
            Record record = recordRepository.findById(recordId).orElseThrow(() -> new IllegalArgumentException("Record not found"));
            record.updateCompleted();
            recordRepository.save(record);
            runningConsumer.clearRunningInfo(recordId);
            log.info("Successfully processed end record: {}, result: {}", recordId, result);
            return result;
        } catch (Exception e) {
            log.error("Error processing end record: {}", recordId, e);
            throw e;
        }
    }

    @MessageMapping("/running/team/{teamId}/{memberId}/end")
    @SendTo("/sub/running/team/{teamId}/{memberId}/end")
    public RunningResultDto finishGroup(@DestinationVariable String teamId, @DestinationVariable String memberId) {
        log.info("Team ID: request received: {}", teamId);
        try {
            RunningResultDto result =  runningConsumer.finishTeam(teamId, memberId);
            runningConsumer.clearRunningInfo(teamId, memberId);
            log.info("Successfully processed end record: {}, result: {}", memberId, result);
            return result;
        } catch (Exception e) {
            log.error("Error processing end team: {}", teamId, e);
            throw e;
        }
    }
}
