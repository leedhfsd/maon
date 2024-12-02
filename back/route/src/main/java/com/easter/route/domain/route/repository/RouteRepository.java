package com.easter.route.domain.route.repository;

import com.easter.route.domain.route.entity.Route;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RouteRepository extends MongoRepository<Route, String> {
}
