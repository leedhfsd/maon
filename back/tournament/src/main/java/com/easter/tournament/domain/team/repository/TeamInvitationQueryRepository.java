package com.easter.tournament.domain.team.repository;

import com.easter.tournament.domain.team.entity.QTeam;
import com.easter.tournament.domain.team.entity.QTeamInvitation;
import com.easter.tournament.domain.team.entity.TeamInvitation;
import com.easter.tournament.domain.team.model.dto.SimpleInvitationDto;
import com.easter.tournament.domain.tournament.entity.QTournament;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class TeamInvitationQueryRepository {
    private final JPAQueryFactory queryFactory;
    private final QTeamInvitation teamInvitation = QTeamInvitation.teamInvitation;
    private final EntityManager entityManager;

//    public List<TeamInvitation> findInvitationRequest(UUID memberId) {
//        QTeam team = QTeam.team;
//        return queryFactory.selectFrom(teamInvitation).where(
//                teamInvitation.inviteeId.eq(memberId).and(
//                        teamInvitation.valid.eq(true)
//                )
//        ).leftJoin(teamInvitation.team, team).fetchJoin().fetch();
//    }

    public TeamInvitation findByUuid(UUID uuid) {
        QTeam team = QTeam.team;
        return queryFactory.selectFrom(teamInvitation)
                .leftJoin(teamInvitation.team, team).fetchJoin()
                .where(teamInvitation.uuid.eq(uuid).and(
                        teamInvitation.teamId.eq(team.id)
                ))
                .fetchOne();
    }

    public List<SimpleInvitationDto> findInvitationRequest(UUID memberId) {
        QTeam team = QTeam.team;
        QTournament tournament = QTournament.tournament;
        return queryFactory.select(Projections.constructor(SimpleInvitationDto.class,
                        teamInvitation.uuid, teamInvitation.inviterNickname, teamInvitation.inviterImage, teamInvitation.team.name, tournament.title))
                .from(teamInvitation)
                .join(teamInvitation.team, team)  // team을 join
                .join(team.tournament, tournament)  // tournament를 join
                .where(teamInvitation.inviteeId.eq(memberId).and(
                        teamInvitation.valid.eq(true).and(
                                teamInvitation.team.tournamentId.eq(tournament.id)
                        )
                )).fetch();
    }

    public TeamInvitation findDuplicatedRequest(UUID inviterId, UUID inviteeId, long teamId) {
        return queryFactory.selectFrom(teamInvitation).where(
                teamInvitation.inviterId.eq(inviterId).and(
                        teamInvitation.inviteeId.eq(inviteeId).and(
                                teamInvitation.teamId.eq(teamId).and(teamInvitation.valid.eq(true))
                        )
                )
        ).fetchOne();
    }

    public List<UUID> findWaitingMemberId(long teamId) {
        return queryFactory.select(teamInvitation.inviteeId).from(teamInvitation).where(
                teamInvitation.valid.eq(true).and(
                        teamInvitation.teamId.eq(teamId)
                )
        ).fetch();
    }

    public void invalidateDroppedInvitations(UUID inviteeId, long tournamentId) {
        long updatedRows = queryFactory.update(teamInvitation)
                .set(teamInvitation.valid, false)
                .where(
                        teamInvitation.inviteeId.eq(inviteeId)
                                .and(teamInvitation.team.tournamentId.eq(tournamentId))
                                .and(teamInvitation.valid.eq(true))
                )
                .execute();

        entityManager.clear(); // 영속성 컨텍스트 초기화
    }

    public TeamInvitation findByInviteeAndTeamId(UUID inviteeId, long teamId) {
        return queryFactory.selectFrom(teamInvitation)
                .where(teamInvitation.inviteeId.eq(inviteeId).and(teamInvitation.teamId.eq(teamId)))
                .fetchOne();
    }
//
//    public List<UUID> find

}
