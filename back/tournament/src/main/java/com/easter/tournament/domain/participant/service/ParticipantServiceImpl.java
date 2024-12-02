package com.easter.tournament.domain.participant.service;

import com.easter.tournament.domain.participant.entity.Participant;
import com.easter.tournament.domain.participant.model.ParticipantStatus;
import com.easter.tournament.domain.participant.model.dto.ParticipantRequestDto;
import com.easter.tournament.domain.participant.repository.ParticipantRepository;
import com.easter.tournament.domain.team.repository.TeamRepository;
import com.easter.tournament.domain.tournament.entity.Tournament;
import com.easter.tournament.domain.tournament.repository.TournamentRepository;
import com.easter.tournament.global.exception.BusinessException;
import com.easter.tournament.global.security.PassportDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ParticipantServiceImpl implements ParticipantService {

    private final ParticipantRepository participantRepository;
    private final TournamentRepository tournamentRepository;
    private final TeamRepository teamRepository;

    @Override
    public void marathonJoin(PassportDto passport, ParticipantRequestDto participantRequestDto) {

        Optional<Tournament> tournament = Optional.ofNullable(tournamentRepository.findByUuid(participantRequestDto.getTournamentId()));

        // todo : team id 관련 처리 해야할듯
        
        if (tournament.isPresent()) {

            if(tournament.get().isClosed()) {
                throw new BusinessException(HttpStatus.NOT_EXTENDED, "대회 접수 기간이 아닙니다.");
            }

            Optional<Participant> byMemberIdAndTournament = participantRepository.findByMemberIdAndTournament(passport.getId(), participantRequestDto.getTournamentId());
            if (byMemberIdAndTournament.isPresent()) {
                throw new BusinessException(HttpStatus.CONFLICT, "이미 참가한 사람입니다.");
            }

            Participant participant = Participant.builder()
                    .tournamentId(tournament.get().getId())
                    .status(ParticipantStatus.DONE)
                    .tournamentCategory(participantRequestDto.getTournamentCategory())
                    .memberId(passport.getId())
                    .build();

            participantRepository.save(participant);

        } else {
            throw new BusinessException(HttpStatus.NOT_FOUND, "참가하려는 대회가 없습니다.");
        }

    }

}
