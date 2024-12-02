package com.easter.route.domain.marathonRoute.service;

import java.util.List;

import com.easter.route.domain.marathonRoute.domain.dto.CreateMarathonCourseRequestDto;
import com.easter.route.domain.marathonRoute.domain.dto.DeleteMarathonCourseRequestDto;
import com.easter.route.domain.marathonRoute.domain.dto.MarathonRouteDto;
import com.easter.route.global.security.PassportDto;

public interface MarathonRouteService {
	MarathonRouteDto createMarathonCourse(CreateMarathonCourseRequestDto requestDto);
	void deleteMarathonCourse(PassportDto passport, DeleteMarathonCourseRequestDto requestDto);
	MarathonRouteDto getMarathonCourseById(String marathonRouteId);
	List<MarathonRouteDto> getMarathonCourseList();
}
