package com.easter.route.domain.marathonRoute.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.easter.route.domain.marathonRoute.domain.entity.MarathonRoute;

public interface MarathonRouteRepository extends MongoRepository<MarathonRoute, String> {
}
