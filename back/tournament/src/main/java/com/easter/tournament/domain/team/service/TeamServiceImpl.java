package com.easter.tournament.domain.team.service;

import com.easter.tournament.domain.participant.entity.Participant;
import com.easter.tournament.domain.participant.model.ParticipantStatus;
import com.easter.tournament.domain.participant.repository.ParticipantQueryRepository;
import com.easter.tournament.domain.participant.repository.ParticipantRepository;
import com.easter.tournament.domain.team.entity.Team;
import com.easter.tournament.domain.team.entity.TeamInvitation;
import com.easter.tournament.domain.team.model.dto.*;
import com.easter.tournament.domain.team.repository.TeamInvitationQueryRepository;
import com.easter.tournament.domain.team.repository.TeamInvitationRepository;
import com.easter.tournament.domain.team.repository.TeamQueryRepository;
import com.easter.tournament.domain.team.repository.TeamRepository;
import com.easter.tournament.domain.tournament.entity.Tournament;
import com.easter.tournament.domain.tournament.repository.TournamentRepository;
import com.easter.tournament.global.exception.BusinessException;
import com.easter.tournament.global.security.PassportDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {

    private final TeamInvitationQueryRepository teamInvitationQueryRepository;
    @Value("${external-url.member}")
    private String memberUrl;

    private final TeamRepository teamRepository;
    private final TeamQueryRepository teamQueryRepository;
    private final TeamInvitationRepository teamInvitationRepository;
    private final TournamentRepository tournamentRepository;
    private final ParticipantQueryRepository participantQueryRepository;
    private final ParticipantRepository participantRepository;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public CreateTeamResponseDto createTeam(PassportDto passport, CreateTeamRequestDto dto) {
        Tournament tournament = tournamentRepository.findByUuid(dto.getTournamentId());
        if (tournament == null) {
            log.error("tournament not found");
            throw new BusinessException(HttpStatus.BAD_REQUEST, "경기 정보를 찾을 수 없습니다.");
        }
        Participant participant = participantQueryRepository.findParticipant(passport.getId(), tournament.getId());
        // 잘 참여하고 있는가를 확인
//        log.info("participant : {}", participant.toString());
        if (participant == null || participant.getStatus() == ParticipantStatus.CANCEL) {
            log.error("participant not found or canceled");
            throw new BusinessException(HttpStatus.BAD_REQUEST, "해당 경기에 정상 참가한 사용자가 아닙니다.");
        }
        if (participant.getTeamId() != null) {
            log.error("this member already joined team");
            throw new BusinessException(HttpStatus.BAD_REQUEST, "이미 팀이 있는 회원입니다.");
        }
        // [1] 팀 생성
        Team team = Team.builder()
                .name(dto.getName())
                .tournamentId(tournament.getId())
                .build();
        teamRepository.save(team);
        // [2] 팀 참여목록에 자기자신 추가
        participant = participant.toBuilder().teamId(team.getId()).build();
        participantRepository.save(participant);
        return CreateTeamResponseDto.builder()
                .teamId(team.getUuid())
                .tournamentId(tournament.getUuid())
                .build();
    }

    @Override
    public SearchTeamMemberResponseDto searchTeamMember(UUID teamId) {
        Team team = teamRepository.findByUuid(teamId).orElseThrow(() -> new BusinessException(HttpStatus.BAD_REQUEST, "유효하지 않은 정보입니다."));
        List<UUID> memberIdList = participantQueryRepository.findMemberIdByTeamId(team.getId());
        // 이후 뒷쪽에 수락대기중인 멤버의 id를 삽입
        List<UUID> waitingIdList = teamInvitationQueryRepository.findWaitingMemberId(team.getId());
        memberIdList.addAll(waitingIdList);
        Set<UUID> waitingSet = new HashSet<>(waitingIdList);
        SearchMemberResponseDto memberResponseDto = getMemberInfo(memberIdList,null);
        List<TeamMemberDto> resultList = new ArrayList<>();
        for(MemberDto member : memberResponseDto.getMemberInfoList()) {
            boolean confirmed;
            if(waitingSet.contains(member.getId())) {
                // 대기중 멤버라면 false
                confirmed = false;
            } else {
                confirmed = true;
            }
            resultList.add(
                    TeamMemberDto.builder()
                            .id(member.getId())
                            .name(member.getName())
                            .nickname(member.getNickname())
                            .email(member.getEmail())
                            .imageUrl(member.getImageUrl())
                            .confirmed(confirmed)
                            .build()
            );
        }
        return SearchTeamMemberResponseDto.builder().teamMemberList(resultList).build();
    }

    @Override
    public void leaveTeam(PassportDto passport, UUID teamId) {
        Team team = teamRepository.findByUuid(teamId)
                .orElseThrow(() -> new BusinessException(HttpStatus.BAD_REQUEST, "유효하지 않은 값입니다."));
        Participant participant = participantQueryRepository.findByMemberIdAndTeamId(passport.getId(), team.getId());
        if(participant == null) {
            log.error("this member is not team member");
            throw new BusinessException(HttpStatus.BAD_REQUEST, "유효하지 않은 값입니다.");
        }
        participant = participant.toBuilder().teamId(null).build();
        participantRepository.save(participant); // 팀 id 부분을 비운다
    }

    @Override
    public SearchCandidateResponseDto searchCandidate(PassportDto passport, SearchCandidateRequestDto dto) {
        Team team = teamQueryRepository.findByUuid(dto.getTeamId());
        if(team == null) {
            log.error("invalid team id : {}", dto.getTeamId());
            throw new BusinessException(HttpStatus.BAD_REQUEST, "유효하지 않은 정보입니다.");
        }
        Tournament tournament = team.getTournament();
        if(tournament == null) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "유효하지 않은 정보입니다.");
        }
        log.info("found tournament : [{}] {}", tournament.getId(), tournament.getTitle());
        List<UUID> candidateIdList = participantQueryRepository.findCandidateByTournamentId(tournament.getId());
//        log.info(String.valueOf(candidateIdList.size()));
        SearchMemberResponseDto memberResponseDto = getMemberInfo(candidateIdList, dto.getKeyword());
        // 다음으로는 초대여부 검색
        List<UUID> waitingIdList = teamInvitationQueryRepository.findWaitingMemberId(team.getId());
        Set<UUID> waitingSet = new HashSet<>(waitingIdList);
        List<CandidateMemberDto> resultList = new ArrayList<>();
        for(MemberDto m : memberResponseDto.getMemberInfoList()) {
            resultList.add(
                    CandidateMemberDto.builder()
                            .id(m.getId())
                            .name(m.getName())
                            .nickname(m.getNickname())
                            .email(m.getEmail())
                            .imageUrl(m.getImageUrl())
                            .invited(waitingSet.contains(m.getId()))
                            .build()
            );
        }
        return SearchCandidateResponseDto.builder()
                .candidateInfoList(resultList)
                .build();
    }

    @Override
    public CheckInvitationResponseDto checkInvitation(PassportDto passport) {
        List<SimpleInvitationDto> resultList = teamInvitationQueryRepository.findInvitationRequest(passport.getId());
        return CheckInvitationResponseDto.builder().invitationList(resultList).build();
    }

    @Override
    public void inviteTeam(PassportDto passport, InviteTeamRequestDto dto) {
        Team team = teamRepository.findByUuid(dto.getTeamId())
                .orElseThrow(() -> new BusinessException(HttpStatus.BAD_REQUEST, "유효하지 않은 정보입니다."));
        Participant inviter = participantQueryRepository.findByMemberIdAndTournamentId(passport.getId(), team.getTournamentId());
        if (inviter == null || inviter.getStatus() == ParticipantStatus.CANCEL || inviter.getTeamId() != team.getId()) {
            log.error("this is not inviter's team");
            throw new BusinessException(HttpStatus.BAD_REQUEST, "유효한 자신의 팀에만 초대할 수 있습니다.");
        }
        Participant invitee = participantQueryRepository.findByMemberIdAndTournamentId(dto.getInviteeId(), team.getTournamentId());
        if (invitee == null || invitee.getStatus() == ParticipantStatus.CANCEL || invitee.getTeamId() != null) {
            log.error("this invitee has some problem");
            throw new BusinessException(HttpStatus.BAD_REQUEST, "초대할 수 없는 사용자입니다.");
        }
        TeamInvitation duplicated = teamInvitationQueryRepository.findDuplicatedRequest(passport.getId(), dto.getInviteeId(), team.getId());
        if(duplicated != null) {
            log.error("duplicated team invite");
            throw new BusinessException(HttpStatus.BAD_REQUEST, "이미 초대 신청을 보냈습니다.");
        }
        TeamInvitation teamInvitation = TeamInvitation.builder()
                .teamId(team.getId())
                .inviterId(passport.getId())
                .inviterNickname(passport.getNickname())
                .inviterImage(passport.getImageUrl())
                .inviteeId(dto.getInviteeId())
                .valid(true)
                .build();
        teamInvitationRepository.save(teamInvitation);
    }

    @Override
    public void cancelInvitation(PassportDto passport, CancelInvitationRequestDto dto) {
        Team team = teamRepository.findByUuid(dto.getTeamId())
                .orElseThrow(() -> new BusinessException(HttpStatus.BAD_REQUEST, "유효하지 않은 값입니다."));
        TeamInvitation inv = teamInvitationQueryRepository.findByInviteeAndTeamId(dto.getInviteeId(), team.getId());
        if(inv == null || !inv.isValid()) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "유효하지 않은 값입니다.");
        }
        teamInvitationRepository.delete(inv);
    }

    @Override
    @Transactional
    public void confirmInvitation(PassportDto passport, ConfirmInvitationRequestDto dto) {
       TeamInvitation invitation = teamInvitationQueryRepository.findByUuid(dto.getInvitationId());
       if(invitation == null) {
           throw new BusinessException(HttpStatus.BAD_REQUEST, "초대 정보를 확인해주세요.");
       }
       if(!invitation.getInviteeId().equals(passport.getId()) || !invitation.isValid()) {
           log.error("invalid invitation");
           throw new BusinessException(HttpStatus.BAD_REQUEST, "유효하지 않은 값입니다.");
       }
       // 공통적으로는 invalid로 만들어줘야 함
       invitation = invitation.toBuilder().valid(false).build();
       teamInvitationRepository.save(invitation);
       if(dto.isAccept()) {
           // 수락했다면 팀 정보를 추가
           log.info("accepted");
           Participant participant = participantQueryRepository.findParticipant(passport.getId(), invitation.getTeam().getTournamentId());
           if(participant.getTeamId() != null) {
               log.error("this member already has team");
               throw new BusinessException(HttpStatus.CONFLICT, "이미 속한 팀이 있습니다.");
           }
           participant = participant.toBuilder().teamId(invitation.getTeam().getId()).build();
           participantRepository.save(participant);
           // 이후 같은 경기에 대해 들어온 팀 요청 invalid 처리
           teamInvitationQueryRepository.invalidateDroppedInvitations(passport.getId(), invitation.getTeam().getTournamentId());
       }
    }

    private SearchMemberResponseDto getMemberInfo(List<UUID> memberIdList, String nicknameKeyword) {
        if(memberIdList == null || memberIdList.size() == 0) {
            return SearchMemberResponseDto.builder().memberInfoList(new ArrayList<>()).build();
        }
        ResponseEntity<Map> memberResponse = restClient.post().uri(memberUrl + "/service/search").contentType(MediaType.APPLICATION_JSON)
                .body(SearchMemberRequestDto.builder().idList(memberIdList).nicknameKeyword(nicknameKeyword).build())
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (request, response) -> {
                    throw new BusinessException(HttpStatus.BAD_REQUEST, "멤버 서비스와 통신 실패");
                })
                .onStatus(HttpStatusCode::is5xxServerError, (request, response) -> {
                    throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "멤버 서비스와 통신 실패");
                })
                .toEntity(Map.class);
        return objectMapper.convertValue(memberResponse.getBody().get("data"), SearchMemberResponseDto.class);
    }
}
