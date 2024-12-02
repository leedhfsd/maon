package com.easter.tournament.domain.tournament.service;

import com.easter.tournament.domain.tournament.model.dto.*;
import com.easter.tournament.global.security.PassportDto;

import java.util.List;
import java.util.UUID;

public interface TournamentService {
    List<GetMarathonResponseDto> getMarathon(PassportDto passport, GetMarathonRequestDto getMarathonRequestDto);

    GetMarathonDetailResponseDto getMarathonDetail(PassportDto passport, UUID uuid);

    List<GetMarathonResponseDto> getMarathonByTitle(String title);

    SearchMyTournamentResponseDto searchMyTournament(PassportDto passport);

    void bookmark(PassportDto passport, BookmarkRequestDto dto);

    void unbookmark(PassportDto passport, BookmarkRequestDto dto);

}
