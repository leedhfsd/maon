package com.easter.tournament.domain.team.repository;

import com.easter.tournament.domain.team.entity.TeamInvitation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TeamInvitationRepository extends JpaRepository<TeamInvitation, Long> {
    <S extends TeamInvitation> S save(S s);
    Optional<TeamInvitation> findByUuid(UUID uuid);
    void delete(TeamInvitation teamInvitation);
}
