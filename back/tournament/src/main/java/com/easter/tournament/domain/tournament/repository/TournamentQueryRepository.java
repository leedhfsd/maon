package com.easter.tournament.domain.tournament.repository;

import com.easter.tournament.domain.tournament.entity.QTournament;
import com.easter.tournament.domain.tournament.entity.QTournamentAssignment;
import com.easter.tournament.domain.tournament.entity.QTournamentCategory;
import com.easter.tournament.domain.tournament.entity.Tournament;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

import static com.querydsl.core.types.dsl.Expressions.numberTemplate;

@Repository
@RequiredArgsConstructor
@Slf4j
public class TournamentQueryRepository {
    private final JPAQueryFactory jpaQueryFactory;
    private final QTournament tournament = QTournament.tournament;

    public List<Tournament> findByYearAndMonth(Integer year, Integer month, Integer areaCodeId, boolean closed) {
        QTournamentAssignment tournamentAssignment = QTournamentAssignment.tournamentAssignment;
        QTournamentCategory tournamentCategory = QTournamentCategory.tournamentCategory;

        BooleanBuilder builder = new BooleanBuilder();

        log.info("year : {}, month : {}, areaCodeId : {}" ,year, month, areaCodeId);
        log.info("is closed : {}", closed);

        // 1. 년도로만 검색
        if (year != 0 && month == 0 && areaCodeId == 0) {
            builder.and(year(tournament.tournamentDayStart).eq(year));
        }
        // 2. 년도, 월로 검색
        else if (year != 0 && month != 0 && areaCodeId == 0) {
            builder.and(year(tournament.tournamentDayStart).eq(year))
                    .and(month(tournament.tournamentDayStart).eq(month));
        }
        // 3. 년도, 장소 검색
        else if (year != 0 && month == 0 && areaCodeId != 0) {
            builder.and(year(tournament.tournamentDayStart).eq(year))
                    .and(tournament.areaCode.id.eq(areaCodeId.longValue()));
        }
        // 4. 년도, 월, 장소 검색
        else if (year != 0 && month != 0 && areaCodeId != 0) {
            builder.and(year(tournament.tournamentDayStart).eq(year))
                    .and(month(tournament.tournamentDayStart).eq(month))
                    .and(tournament.areaCode.id.eq(areaCodeId.longValue()));
        }
        // 5. 장소로만 검색
        else if (year == 0 && month == 0 && areaCodeId != 0) {
            builder.and(tournament.areaCode.id.eq(areaCodeId.longValue()));
        }

        if(closed) {
            builder.and(tournament.closed.eq(false));
        }

        return jpaQueryFactory
                .selectFrom(tournament)
                .distinct() // 중복 제거
                .leftJoin(tournament.tournamentAssignment, tournamentAssignment).fetchJoin()
                .leftJoin(tournamentAssignment.category, tournamentCategory).fetchJoin()
                .where(builder)
                .orderBy(tournament.tournamentDayStart.asc())
                .fetch();
    }

    public Tournament findByUuid(UUID uuid) {
        QTournamentAssignment tournamentAssignment = QTournamentAssignment.tournamentAssignment;
        QTournamentCategory tournamentCategory = QTournamentCategory.tournamentCategory;

        return jpaQueryFactory.selectFrom(tournament)
                .leftJoin(tournament.tournamentAssignment, tournamentAssignment).fetchJoin()
                .leftJoin(tournamentAssignment.category, tournamentCategory).fetchJoin()
                .where(tournament.uuid.eq(uuid))
                .fetchOne();
    }


    // QueryDSL에서 LocalDateTime의 year 추출
    private static com.querydsl.core.types.dsl.NumberExpression<Integer> year(com.querydsl.core.types.dsl.DateTimePath<java.time.LocalDateTime> dateTimePath) {
        return numberTemplate(Integer.class, "YEAR({0})", dateTimePath);
    }

    // QueryDSL에서 LocalDateTime의 month 추출
    private static com.querydsl.core.types.dsl.NumberExpression<Integer> month(com.querydsl.core.types.dsl.DateTimePath<java.time.LocalDateTime> dateTimePath) {
        return numberTemplate(Integer.class, "MONTH({0})", dateTimePath);
    }
}