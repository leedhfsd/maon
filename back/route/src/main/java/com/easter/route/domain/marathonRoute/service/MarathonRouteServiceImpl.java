package com.easter.route.domain.marathonRoute.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.easter.route.domain.marathonRoute.domain.dto.CreateMarathonCourseRequestDto;
import com.easter.route.domain.marathonRoute.domain.dto.DeleteMarathonCourseRequestDto;
import com.easter.route.domain.marathonRoute.domain.dto.MarathonRouteDto;
import com.easter.route.domain.marathonRoute.domain.entity.MarathonRoute;
import com.easter.route.domain.marathonRoute.repository.MarathonRouteRepository;
import com.easter.route.global.exception.BusinessException;
import com.easter.route.global.security.PassportDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MarathonRouteServiceImpl implements MarathonRouteService {

	private final MarathonRouteRepository marathonRouteRepository;

	@Override
	public MarathonRouteDto createMarathonCourse(CreateMarathonCourseRequestDto requestDto) {
		MarathonRoute newRoute = requestDto.toEntity();
		marathonRouteRepository.save(newRoute);
		return MarathonRouteDto.of(newRoute);
	}

	@Override
	public void deleteMarathonCourse(PassportDto passport, DeleteMarathonCourseRequestDto requestDto) {
		if (passport == null || passport.getId() == null) {
			throw new BusinessException(HttpStatus.FORBIDDEN, "회원 정보를 확인해주세요.");
		}
		try {
			marathonRouteRepository.deleteById(requestDto.getMarathonRouteId());
		} catch (Exception e) {
			throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "마라톤 경로 삭제에 실패했습니다.");
		}
	}

	@Override
	public MarathonRouteDto getMarathonCourseById(String marathonRouteId) {
		MarathonRoute marathonRoute = marathonRouteRepository.findById(marathonRouteId)
			.orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "마라톤 경로를 찾을 수 없습니다."));
		return MarathonRouteDto.of(marathonRoute);
	}

	@Override
	public List<MarathonRouteDto> getMarathonCourseList() {
		List<MarathonRoute> list = marathonRouteRepository.findAll();
		return list.stream().map(MarathonRouteDto::of).toList();
	}
}
