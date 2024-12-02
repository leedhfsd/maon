package com.easter.tournament.domain.team.controller;

import com.easter.tournament.domain.team.model.dto.*;
import com.easter.tournament.domain.team.service.TeamService;
import com.easter.tournament.global.response.ResultResponse;
import com.easter.tournament.global.security.PassportDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/maon/tournament/team")
public class TeamController {

    private final TeamService teamService;

    /**
     * 마라톤 팀 생성
     * @return
     */
    @PostMapping("/create")
    public ResponseEntity<ResultResponse> join(@RequestAttribute("passport") PassportDto passport, @RequestBody CreateTeamRequestDto dto){
        log.info("create team");
        CreateTeamResponseDto responseDto = teamService.createTeam(passport, dto);
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "팀을 생성했습니다.", responseDto);
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }

    /**
     * 마라톤 팀 구성원 조회
     * @return
     */
    @GetMapping("/{teamId}")
    public ResponseEntity<ResultResponse> search(@PathVariable UUID teamId){
        log.info("search team members");
        SearchTeamMemberResponseDto responseDto = teamService.searchTeamMember(teamId);
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "팀 구성원을 조회했습니다.", responseDto);
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }

    /**
     * 마라톤 팀 탈퇴
     * @return
     */
//    @DeleteMapping("/leave/{teamId}")
//    public ResponseEntity<ResultResponse> leave(@RequestAttribute("passport") PassportDto passport, @PathVariable("teamId") UUID teamId){
//        log.info("leave team [{}]", teamId);
//        teamService.leaveTeam(passport, teamId);
//        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "팀을 탈퇴했습니다.");
//        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
//    }

    @PostMapping("/leave/{teamId}")
    public ResponseEntity<ResultResponse> leave(@RequestAttribute("passport") PassportDto passport, @PathVariable("teamId") UUID teamId){
        log.info("leave team [{}]", teamId);
        teamService.leaveTeam(passport, teamId);
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "팀을 탈퇴했습니다.");
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }
    /* 팀 초대 관련 */

    /**
     * 자신에게 온 팀 초대 확인
     * @return
     */
    @GetMapping("/invite/list")
    public ResponseEntity<ResultResponse> checkInvite(@RequestAttribute("passport") PassportDto passport) {
        log.info("check team invite");
        CheckInvitationResponseDto responseDto = teamService.checkInvitation(passport);
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "초대 리스트를 조회했습니다.", responseDto);
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }


    /**
     * 마라톤 팀 초대 가능 멤버 조회
     * @return
     */
    @PostMapping("/invite/candidate")
    public ResponseEntity<ResultResponse> searchCandidate(@RequestAttribute("passport") PassportDto passport, @RequestBody SearchCandidateRequestDto dto) {
        log.info("search candidate member");
        SearchCandidateResponseDto responseDto = teamService.searchCandidate(passport, dto);
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "팀 초대 후보를 조회했습니다.", responseDto);
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }

    /**
     * 마라톤 팀 초대 신청 전송
     * @return
     */
    @PostMapping("/invite")
    public ResponseEntity<ResultResponse> inviteTeam(@RequestAttribute("passport") PassportDto passport, @RequestBody InviteTeamRequestDto dto) {
        log.info("invite team member");
        teamService.inviteTeam(passport, dto);
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "팀 멤버를 초대했습니다.");
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }

    /**
     * 마라톤 팀 초대 취소
     * @return
     */
    @PostMapping("/invite/cancel")
    public ResponseEntity<ResultResponse> cancelInvitation(@RequestAttribute("passport") PassportDto passport, @RequestBody CancelInvitationRequestDto dto) {
        log.info("cancel team invitation");
        teamService.cancelInvitation(passport, dto);
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "팀 멤버를 초대를 취소했습니다.");
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }

    /**
     * 마라톤 팀 초대 요청 처리
     * @return
     */
    @PostMapping("/invite/confirm")
    public ResponseEntity<ResultResponse> confirmInvite(@RequestAttribute("passport") PassportDto passport, @RequestBody ConfirmInvitationRequestDto dto) {
        log.info("confirm invite : {} - {}", dto.getInvitationId(), dto.isAccept());
        teamService.confirmInvitation(passport, dto);
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "초대 요청을 처리했습니다.");
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }
}
