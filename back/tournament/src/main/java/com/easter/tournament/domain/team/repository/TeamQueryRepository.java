package com.easter.tournament.domain.team.repository;

import com.easter.tournament.domain.participant.entity.QParticipant;
import com.easter.tournament.domain.team.entity.QTeam;
import com.easter.tournament.domain.team.entity.Team;
import com.easter.tournament.domain.tournament.entity.QTournament;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class TeamQueryRepository {
    private final JPAQueryFactory queryFactory;
    private final QTeam team = QTeam.team;

    public Team findByUuid(UUID teamId) {
        QTournament tournament = QTournament.tournament;
        return queryFactory.selectFrom(team)
                .leftJoin(team.tournament, tournament).fetchJoin()
                .where(team.uuid.eq(teamId))
                .fetchOne();
    }
}
