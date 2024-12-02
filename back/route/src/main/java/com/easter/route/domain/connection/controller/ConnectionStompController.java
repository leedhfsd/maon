package com.easter.route.domain.connection.controller;

import com.easter.route.domain.connection.model.dto.*;
import com.easter.route.domain.connection.service.ConnectionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ConnectionStompController {

    private final ConnectionService connectionService;
    private final SimpMessageSendingOperations messagingTemplate;
    private final String SUB_PATH = "/sub/connection/";

    @MessageMapping("/connection/info/{code}")
    public void connectToMember(@DestinationVariable String code, MemberInfoDto dto) {
        log.info("connecting to {} at {}", dto.getMemberId(), dto.getTimestamp());
        connectionService.saveMemberInfo(dto, code);
    }

    @MessageMapping("/connection/watch/{code}")
    public void watchConnectionTest(@DestinationVariable String code, SimpleTimestampDto dto) {
        log.info("start connection test at {}", dto.getTimestamp());
        ConnectionResultDto sendDto = connectionService.connect(code);
        messagingTemplate.convertAndSend(SUB_PATH + code, sendDto);
//        WatchConnectDto sendDto = connectionService.connectionSuccess(code);
//        messagingTemplate.convertAndSend(SUB_PATH + code, sendDto);
    }

    @MessageMapping("/heartRate/{recordId}")
    public void sendHeartRate(@DestinationVariable String recordId, HeartRateDto dto) {
        log.info("received heart rate data : {}", dto.getHeartRate());
        messagingTemplate.convertAndSend("/sub/heartRate/" + recordId, dto); // 단순 전달만 시행
    }

}
