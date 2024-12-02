package com.easter.tournament.domain.participant.repository;

import com.easter.tournament.domain.participant.entity.Participant;
import com.easter.tournament.domain.participant.entity.QParticipant;
import com.easter.tournament.domain.participant.model.ParticipantStatus;
import com.easter.tournament.domain.team.entity.QTeam;
import com.easter.tournament.domain.tournament.entity.QTournament;
import com.easter.tournament.domain.tournament.model.dto.MyTournament;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class ParticipantQueryRepository {
    private final JPAQueryFactory queryFactory;
    private final QParticipant participant = QParticipant.participant;

    public Participant findParticipant(UUID memberId, long tournamentId) {
        return queryFactory.selectFrom(participant).where(
                        participant.memberId.eq(memberId).and(
                                participant.tournamentId.eq(tournamentId)
                        )
                ).fetchOne();
    }

    public Participant findParticipantFetch(UUID memberId, long tournamentId) {
        QTeam team = QTeam.team;
        return queryFactory.selectFrom(participant)
                .leftJoin(participant.team, team).fetchJoin()
                .where(
                participant.memberId.eq(memberId).and(
                        participant.tournamentId.eq(tournamentId)
                )
        ).fetchOne();
    }

    public List<UUID> findMemberIdByTeamId(long teamId) {
        return queryFactory.select(participant.memberId).from(participant).where(
                participant.teamId.eq(teamId)
        ).fetch();
    }

    public List<UUID> findCandidateByTournamentId(long tournamentId) {
        return queryFactory.select(participant.memberId).from(participant).where(
                participant.tournamentId.eq(tournamentId).and(
                        participant.teamId.isNull()
                )
        ).fetch();
    }

    public List<MyTournament> findMyTournament(UUID memberId) {
        QTournament tournament = QTournament.tournament;
        return queryFactory.select(Projections.constructor(MyTournament.class,
                        tournament.uuid, tournament.title, tournament.tournamentDayStart, tournament.tournamentDayEnd, participant.tournamentCategory, tournament.location, tournament.longitude, tournament.latitude, tournament.imageUrl))
                .from(participant)
                .join(participant.tournament, tournament)
                .where(participant.memberId.eq(memberId)
                        .and(tournament.tournamentDayEnd.after(LocalDateTime.now())
                                .and(participant.status.ne(ParticipantStatus.CANCEL)))
                        )
                .orderBy(tournament.tournamentDayStart.asc())
                .fetch();
    }

    public Participant findByMemberIdAndTournamentId(UUID memberId, long tournamentId) {
        return queryFactory.selectFrom(participant).where(
                participant.memberId.eq(memberId).and(participant.tournamentId.eq(tournamentId))).fetchOne();
    }

    public Participant findByMemberIdAndTeamId(UUID memberId, long teamId) {
        return queryFactory.selectFrom(participant).where(
                participant.memberId.eq(memberId).and(participant.teamId.eq(teamId))).fetchOne();
    }

}
