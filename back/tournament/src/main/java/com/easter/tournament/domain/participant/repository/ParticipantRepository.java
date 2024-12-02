package com.easter.tournament.domain.participant.repository;

import com.easter.tournament.domain.participant.entity.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    @Query("select p from Participant p where p.memberId = :memberId and p.tournament.uuid = :tournamentId")
    Optional<Participant> findByMemberIdAndTournament(@Param("memberId") UUID memberId, @Param("tournamentId") UUID tournamentId);
}
