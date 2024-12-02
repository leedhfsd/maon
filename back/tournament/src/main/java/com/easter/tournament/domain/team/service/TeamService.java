package com.easter.tournament.domain.team.service;

import com.easter.tournament.domain.team.model.dto.*;
import com.easter.tournament.global.security.PassportDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

public interface TeamService {
    CreateTeamResponseDto createTeam(PassportDto passport, CreateTeamRequestDto dto);
    SearchTeamMemberResponseDto searchTeamMember(UUID teamId);
    void leaveTeam(PassportDto passport, UUID teamId);
    SearchCandidateResponseDto searchCandidate(PassportDto passport, SearchCandidateRequestDto dto);
    CheckInvitationResponseDto checkInvitation(PassportDto passport);
    void inviteTeam(PassportDto passport, InviteTeamRequestDto dto);
    void cancelInvitation(PassportDto passport, CancelInvitationRequestDto dto);
    void confirmInvitation(PassportDto passport, ConfirmInvitationRequestDto dto);
}
