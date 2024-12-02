package com.easter.tournament.domain.tournament.repository;

import com.easter.tournament.domain.tournament.entity.QTournamentBookmark;
import com.easter.tournament.domain.tournament.entity.TournamentBookmark;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
@RequiredArgsConstructor
@Slf4j
public class BookmarkQueryRepository {
    private final JPAQueryFactory queryFactory;
    private final QTournamentBookmark bookmark = QTournamentBookmark.tournamentBookmark;

    public TournamentBookmark findByMemberIdAndTournamentId(UUID memberId, long tournamentId) {
        return queryFactory.selectFrom(bookmark).where(
                bookmark.memberId.eq(memberId).and(bookmark.tournamentId.eq(tournamentId))
        ).fetchOne();
    }
}
