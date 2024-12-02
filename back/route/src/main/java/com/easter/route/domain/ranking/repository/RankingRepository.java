package com.easter.route.domain.ranking.repository;

import com.easter.route.domain.ranking.entity.Ranking;

import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RankingRepository extends MongoRepository<Ranking, String> {
    Optional<Ranking> findByRouteId(String routeId);
}
