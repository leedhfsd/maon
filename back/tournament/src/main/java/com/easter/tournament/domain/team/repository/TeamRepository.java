package com.easter.tournament.domain.team.repository;

import com.easter.tournament.domain.team.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    <S extends Team> S save(S entity);
    Optional<Team> findByUuid(UUID uuid);
}
