package com.easter.member.domain.member.controller;

import com.easter.member.domain.member.model.dto.GetMemberInfoResponseDto;
import com.easter.member.domain.member.service.MemberService;
import com.easter.member.global.response.ResultResponse;
import com.easter.member.global.security.userinfo.PassportDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/maon/member/mypage")
public class MyPageController {

    private final MemberService memberService;

    @GetMapping("/info")
    public ResponseEntity<ResultResponse> getMyInfo(@RequestAttribute("passport") PassportDto passport) {
        log.info("get my member info");
        GetMemberInfoResponseDto responseDto = memberService.getMyInfo(passport);
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "나의 정보를 조회했습니다.", responseDto);
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }
}
