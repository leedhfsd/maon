package com.easter.route.domain.trade.controller;

import com.easter.route.domain.trade.model.dto.StartTradeDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@Controller
@RequiredArgsConstructor
@Slf4j
public class TradeStompController {

    private final SimpMessageSendingOperations messagingTemplate;

    @MessageMapping("/start/{memberId}")
    public void tradeStart(@DestinationVariable("memberId") String memberId, StartTradeDto dto) {
        log.info("trade start message : {}", memberId);
        messagingTemplate.convertAndSend("/sub/start/" + memberId, dto);
    }
}
