package com.easter.tournament.domain.participant.service;

import com.easter.tournament.domain.participant.model.dto.ParticipantRequestDto;
import com.easter.tournament.global.security.PassportDto;

public interface ParticipantService {
    void marathonJoin(PassportDto passport, ParticipantRequestDto participantRequestDto);
}
