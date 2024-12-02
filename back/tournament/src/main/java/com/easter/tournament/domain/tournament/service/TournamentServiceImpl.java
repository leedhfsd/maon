package com.easter.tournament.domain.tournament.service;

import com.easter.tournament.domain.participant.entity.Participant;
import com.easter.tournament.domain.participant.model.ParticipantStatus;
import com.easter.tournament.domain.participant.repository.ParticipantQueryRepository;
import com.easter.tournament.domain.participant.repository.ParticipantRepository;
import com.easter.tournament.domain.team.entity.Team;
import com.easter.tournament.domain.team.model.dto.TeamMemberDto;
import com.easter.tournament.domain.team.service.TeamService;
import com.easter.tournament.domain.tournament.entity.Tournament;
import com.easter.tournament.domain.tournament.entity.TournamentBookmark;
import com.easter.tournament.domain.tournament.model.dto.*;
import com.easter.tournament.domain.tournament.repository.BookmarkQueryRepository;
import com.easter.tournament.domain.tournament.repository.BookmarkRepository;
import com.easter.tournament.domain.tournament.repository.TournamentQueryRepository;
import com.easter.tournament.domain.tournament.repository.TournamentRepository;
import com.easter.tournament.global.exception.BusinessException;
import com.easter.tournament.global.security.PassportDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class TournamentServiceImpl implements TournamentService {

    private final TournamentRepository tournamentRepository;
    private final TournamentQueryRepository tournamentQueryRepository;
    private final ParticipantQueryRepository participantQueryRepository;
    private final BookmarkRepository bookmarkRepository;
    private final TeamService teamService;
    private final BookmarkQueryRepository bookmarkQueryRepository;

    @Override
    public List<GetMarathonResponseDto> getMarathon(PassportDto passport, GetMarathonRequestDto getMarathonRequestDto) {

        Integer year = getMarathonRequestDto.getYear();
        Integer month = getMarathonRequestDto.getMonth();
        Integer area = getMarathonRequestDto.getArea();
        boolean closed = getMarathonRequestDto.isClosed();

        // 북마크 여부를 알아내기 위해 set 추출
        List<TournamentBookmark> bookmarkList = bookmarkRepository.findByMemberId(passport.getId());
        Set<Long> bookmarkIdSet = new HashSet<>();
        for(TournamentBookmark bookmark : bookmarkList) {
            bookmarkIdSet.add(bookmark.getTournamentId());
        }
        List<Tournament> tournaments = tournamentQueryRepository.findByYearAndMonth(year, month, area, closed);

        List<GetMarathonResponseDto> getMarathonResponseDtos = tournaments.stream().map(
                tournament -> {
                    List<String> categoryValues = tournament.getTournamentAssignment().stream().map(
                            tournamentAssignment -> {
                                return tournamentAssignment.getCategory().getCategoryValue();
                            }
                    ).toList();


                    return GetMarathonResponseDto.builder()
                            .title(tournament.getTitle())
                            .host(tournament.getHost())
                            .uuid(tournament.getUuid())
                            .homepage(tournament.getHomepage())
                            .location(tournament.getLocation())
                            .receiptStart(tournament.getReceiptStart())
                            .receiptEnd(tournament.getReceiptEnd())
                            .tournamentDayStart(tournament.getTournamentDayStart())
                            .tournamentDayEnd(tournament.getTournamentDayEnd())
                            .longitude(tournament.getLongitude())
                            .latitude(tournament.getLatitude())
                            .inquiry(tournament.getInquiry())
                            .imageUrl(tournament.getImageUrl())
                            .closed(tournament.isClosed())
                            .categories(categoryValues)
                            .bookmarked(bookmarkIdSet.contains(tournament.getId()))
                            .build();
                }
        ).toList();

        return getMarathonResponseDtos;
    }

    @Override
    public GetMarathonDetailResponseDto getMarathonDetail(PassportDto passport, UUID uuid) {

        Tournament tournament = tournamentQueryRepository.findByUuid(uuid);
        if(tournament == null) {
            log.error("invalid tournament uuid : {}", uuid);
            throw new BusinessException(HttpStatus.BAD_REQUEST, "유효하지 않은 값입니다.");
        }
        List<String> categoryValues = tournament.getTournamentAssignment().stream().map(
                tournamentAssignment -> {
                    return tournamentAssignment.getCategory().getCategoryValue();
                }
        ).toList();
        TournamentBookmark bookmark = bookmarkQueryRepository.findByMemberIdAndTournamentId(passport.getId(), tournament.getId());
        // 경기 정보부터 삽입
        GetMarathonDetailResponseDto responseDto = GetMarathonDetailResponseDto.builder()
                .uuid(tournament.getUuid())
                .title(tournament.getTitle())
                .host(tournament.getHost())
                .homepage(tournament.getHomepage())
                .location(tournament.getLocation())
                .receiptStart(tournament.getReceiptStart())
                .receiptEnd(tournament.getReceiptEnd())
                .tournamentDayStart(tournament.getTournamentDayStart())
                .tournamentDayEnd(tournament.getTournamentDayEnd())
                .latitude(tournament.getLatitude())
                .longitude(tournament.getLongitude())
                .inquiry(tournament.getInquiry())
                .closed(tournament.isClosed())
                .categories(categoryValues)
                .bookmarked(bookmark != null)
                .build();
        // 참여여부, 팀 여부를 알아내기 위해 서치
        Participant participant = participantQueryRepository.findParticipantFetch(passport.getId(), tournament.getId());
        if(participant == null || participant.getStatus() == ParticipantStatus.CANCEL) {
            return responseDto;
        }
        responseDto.setParticipated(true);
        Team team = participant.getTeam();
        if(team == null) { // 팀이 없는 경우 그대로 반환
            return responseDto;
        }
        responseDto.setHasTeam(true);
        responseDto.setTeamId(team.getUuid());
        List<TeamMemberDto> memberList = teamService.searchTeamMember(team.getUuid()).getTeamMemberList();
        responseDto.setTeamMembers(memberList);
        return responseDto;
    }

    @Override
    public List<GetMarathonResponseDto> getMarathonByTitle(String title) {

        List<Tournament> tournaments = tournamentRepository.findByTitleLike(title);

        List<GetMarathonResponseDto> getMarathonResponseDtos = tournaments.stream().map(
                tournament -> {
                    return GetMarathonResponseDto.builder()
                            .uuid(tournament.getUuid())
                            .title(tournament.getTitle())
                            .host(tournament.getHost())
                            .homepage(tournament.getHomepage())
                            .location(tournament.getLocation())
                            .receiptStart(tournament.getReceiptStart())
                            .receiptEnd(tournament.getReceiptEnd())
                            .tournamentDayStart(tournament.getTournamentDayStart())
                            .tournamentDayEnd(tournament.getTournamentDayEnd())
                            .closed(tournament.isClosed())
                            .build();
                }
        ).toList();

        return getMarathonResponseDtos;
    }

    @Override
    public SearchMyTournamentResponseDto searchMyTournament(PassportDto passport) {
        List<MyTournament> tournamentList = participantQueryRepository.findMyTournament(passport.getId());
        return SearchMyTournamentResponseDto.builder()
                .tournamentList(tournamentList)
                .build();
    }

    @Override
    public void bookmark(PassportDto passport, BookmarkRequestDto dto) {
        Tournament tournament = tournamentQueryRepository.findByUuid(dto.getTournamentId());
        if(tournament == null) {
            log.error("cannot find tournament : {}", dto.getTournamentId());
            throw new BusinessException(HttpStatus.BAD_REQUEST, "유효하지 않은 값입니다.");
        }
        if(bookmarkQueryRepository.findByMemberIdAndTournamentId(passport.getId(), tournament.getId()) != null) {
            log.error("already bookmarked tournament : {}", dto.getTournamentId());
            throw new BusinessException(HttpStatus.BAD_REQUEST, "유효하지 않은 값입니다.");
        }
        // 부재를 확인했다면 DB insert
        TournamentBookmark bookmark = TournamentBookmark.builder()
                .tournamentId(tournament.getId())
                .memberId(passport.getId())
                .build();
        bookmarkRepository.save(bookmark);
    }

    @Override
    @Transactional
    public void unbookmark(PassportDto passport, BookmarkRequestDto dto) {
        Tournament tournament = tournamentQueryRepository.findByUuid(dto.getTournamentId());
        if(tournament == null) {
            log.error("cannot find tournament : {}", dto.getTournamentId());
            throw new BusinessException(HttpStatus.BAD_REQUEST, "유효하지 않은 값입니다.");
        }
        TournamentBookmark bookmark = bookmarkQueryRepository.findByMemberIdAndTournamentId(passport.getId(), tournament.getId());
        if(bookmark == null) {
            log.error("bookmark does not exist : {}", dto.getTournamentId());
            throw new BusinessException(HttpStatus.BAD_REQUEST, "유효하지 않은 값입니다.");
        }
        bookmarkRepository.delete(bookmark);
    }
}
