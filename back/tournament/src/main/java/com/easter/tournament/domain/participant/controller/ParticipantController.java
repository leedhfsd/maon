package com.easter.tournament.domain.participant.controller;

import com.easter.tournament.domain.participant.model.dto.ParticipantRequestDto;
import com.easter.tournament.domain.participant.service.ParticipantService;
import com.easter.tournament.global.response.ResultResponse;
import com.easter.tournament.global.security.PassportDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/maon/tournament/participant")
public class ParticipantController {

    private final ParticipantService participantService;

    /**
     * 마라톤 신청
     * @param participantRequestDto
     */
    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestAttribute("passport") PassportDto passport, @Valid @RequestBody ParticipantRequestDto participantRequestDto) {
        participantService.marathonJoin(passport, participantRequestDto);
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "대회 신청이 완료되었습니다.");
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }
}
