package com.easter.tournament.domain.tournament.repository;

import com.easter.tournament.domain.tournament.entity.TournamentBookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BookmarkRepository extends JpaRepository<TournamentBookmark, Long> {
    <S extends TournamentBookmark> S save(S entity);
    void delete(TournamentBookmark entity);
    List<TournamentBookmark> findByMemberId(UUID memberId);
}
