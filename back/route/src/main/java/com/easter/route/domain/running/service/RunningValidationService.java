package com.easter.route.domain.running.service;

import com.easter.route.domain.running.entity.dto.LocationDto;
import com.easter.route.domain.running.entity.dto.RouteValidationResult;

public interface RunningValidationService {
	RouteValidationResult makeRouteValidationResult(LocationDto locationDto);
}
