package com.easter.member.domain.member.controller;

import com.easter.member.domain.member.model.dto.*;
import com.easter.member.domain.member.service.MemberService;
import com.easter.member.global.response.ResultResponse;
import com.easter.member.global.security.userinfo.PassportDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/maon/member/member")
public class MemberController {

    private final MemberService memberService;

    /* 테스트용 메서드들 : 추후 삭제 예정 */
    @GetMapping("/test")
    public String test(@RequestAttribute("passport") PassportDto passport) throws Exception {
        log.info(passport.toString());
        return "member - test";
    }

    @GetMapping("/logindone")
    public String loginDone(@RequestParam("token") String accessToken) {
        return "login succeed : " + accessToken;
    }
    
    /* 테스트 메서드 종료  */

    @PostMapping("/login")
    public ResponseEntity<ResultResponse> login(@RequestBody LoginRequestDto dto) {
        log.info("login via id_token");
        LoginResponseDto responseDto = memberService.login(dto);
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "로그인 처리를 완료했습니다.", responseDto);
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }

    @PostMapping("/check")
    public ResponseEntity<ResultResponse> checkRedundancy(@RequestBody CheckRedundancyRequestDto dto) {
        log.info("check redundancy of nickname");
        CheckRedundancyResponseDto responseDto = memberService.checkRedundancy(dto);
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "닉네임 중복여부를 조회했습니다.", responseDto);
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }

    @PostMapping("/info")
    public ResponseEntity<ResultResponse> register(@RequestAttribute("passport") PassportDto passport, @ModelAttribute RegisterMemberRequestDto requestDto) {
        log.info("register new member info");
        RegisterMemberResponseDto responseDto = memberService.registerMember(passport, requestDto);
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "회원 가입을 완료했습니다.", responseDto);
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }

    @PostMapping("/info/edit")
    public ResponseEntity<ResultResponse> modify(@RequestAttribute("passport") PassportDto passport, @ModelAttribute UpdateMemberRequestDto dto) {
        log.info("edit member info");
        log.info(dto.toString());
        UpdateMemberResponseDto responseDto = memberService.updateMember(passport, dto);
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "회원 정보를 수정했습니다.", responseDto);
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }
    
    @PostMapping("/reissue")
    public ResponseEntity<ResultResponse> reissue(@RequestBody ReissueTokenRequestDto requestDto) {
        log.info("reissue member info");
        ReissueTokenResponseDto responseDto = memberService.reissueToken(requestDto);
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "액세스 토큰을 재발급했습니다.", responseDto);
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }

    @GetMapping("/logout")
    public ResponseEntity<ResultResponse> logout(@RequestAttribute("passport") PassportDto passport) {
        memberService.logout(passport.getEmail());
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "로그아웃했습니다.");
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }

    @PostMapping("/fcm")
    public ResponseEntity<ResultResponse> saveFcmToken(@RequestAttribute("passport") PassportDto passport, @RequestBody SaveFcmTokenRequestDto dto) {
        log.info("save fcm token : {} - {}", passport.getEmail(), dto.getFcmToken());
        memberService.saveFcmToken(passport, dto);
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "FCM 토큰을 저장했습니다.");
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }

    @GetMapping("/fcm")
    public ResponseEntity<ResultResponse> getFcmToken(@RequestAttribute("passport") PassportDto passport) {
        log.info("get fcm token : {}", passport.getEmail());
        GetFcmTokenResponseDto responseDto = memberService.getFcmToken(passport);
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "FCM 토큰을 불러왔습니다.", responseDto);
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }

}
