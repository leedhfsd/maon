package com.easter.route.domain.marathonRoute.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.easter.route.domain.marathonRoute.domain.dto.CreateMarathonCourseRequestDto;
import com.easter.route.domain.marathonRoute.domain.dto.DeleteMarathonCourseRequestDto;
import com.easter.route.domain.marathonRoute.domain.dto.MarathonRouteDto;
import com.easter.route.domain.marathonRoute.service.MarathonRouteService;
import com.easter.route.global.response.ResultResponse;
import com.easter.route.global.security.PassportDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/maon/route")
public class MarathonRouteController {
	private final MarathonRouteService marathonRouteService;

	@PostMapping("/course/marathon/create")
	public ResponseEntity<ResultResponse> createMarathonCourse(@RequestAttribute("passport") PassportDto passport, CreateMarathonCourseRequestDto requestDto) {
		MarathonRouteDto marathonRouteDto = marathonRouteService.createMarathonCourse(requestDto);
		ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "마라톤 경로 등록을 성공했습니다.", marathonRouteDto);
		return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
	}

	@DeleteMapping("/course/marathon/delete")
	public ResponseEntity<ResultResponse> deleteMarathonCourse(@RequestAttribute("passport") PassportDto passport, DeleteMarathonCourseRequestDto requestDto) {
		marathonRouteService.deleteMarathonCourse(passport, requestDto);
		ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "마라톤 경로를 삭제했습니다.");
		return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
	}

	@GetMapping("/course/marathon/{marathonRouteId}")
	public ResponseEntity<ResultResponse> getMarathonCourseById(@PathVariable String marathonRouteId) {
		MarathonRouteDto marathonRouteDto = marathonRouteService.getMarathonCourseById(marathonRouteId);
		ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "마라톤 경로를 가져왔습니다.", marathonRouteDto);
		return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
	}

	@GetMapping("/course/marathon/list")
	public ResponseEntity<ResultResponse> getMarathonCourseList() {
		List<MarathonRouteDto> marathonRouteList = marathonRouteService.getMarathonCourseList();
		ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "마라톤 경로 리스트를 가져왔습니다.", marathonRouteList);
		return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
	}
}
