package com.easter.member.domain.service.controller;

import com.easter.member.domain.member.service.MemberService;
import com.easter.member.domain.service.model.dto.ConfirmMemberResponseDto;
import com.easter.member.domain.service.model.dto.SearchMemberRequestDto;
import com.easter.member.domain.service.model.dto.SearchMemberResponseDto;
import com.easter.member.domain.service.service.ServiceService;
import com.easter.member.global.response.ResultResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/maon/member/service")
public class ServiceController {

    private final ServiceService service;

    @GetMapping("/confirm/{email}")
    public ResponseEntity<ResultResponse> confirm(@PathVariable String email, @RequestParam("token") String token) {
        log.debug("confirm email : {}", email);
        ConfirmMemberResponseDto responseDto = service.confirmMember(email, token);
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "멤버 정보 확인 완료", responseDto);
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }

    @PostMapping("/search")
    public ResponseEntity<ResultResponse> search(@RequestBody SearchMemberRequestDto dto) {
        log.debug("service request received");
        for(UUID uuid : dto.getIdList()) {
            log.info(uuid.toString());
        }
        log.info("--------------");
        SearchMemberResponseDto responseDto = service.searchMember(dto);
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "멤버 정보 조회 완료", responseDto);
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }
}
