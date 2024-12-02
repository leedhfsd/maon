package com.easter.tournament.domain.tournament.repository;

import com.easter.tournament.domain.tournament.entity.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TournamentRepository extends JpaRepository<Tournament, Long> {
    Tournament findByUuid(UUID uuid);

    @Query("select t from Tournament t where t.title like %:title%")
    List<Tournament> findByTitleLike(@Param("title") String title);

    @Query("SELECT DISTINCT t FROM Tournament t " +
            "LEFT JOIN FETCH t.tournamentAssignment ta " +
            "LEFT JOIN FETCH ta.category tc")
    List<Tournament> findAllWithDetails();
}
