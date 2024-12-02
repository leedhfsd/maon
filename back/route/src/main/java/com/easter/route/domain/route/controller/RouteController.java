package com.easter.route.domain.route.controller;

import java.util.List;

import com.easter.route.domain.record.entity.dto.GetRouteDetailsRequestDto;
import com.easter.route.domain.route.entity.dto.*;
import com.easter.route.domain.route.service.RouteService;
import com.easter.route.global.response.ResultResponse;
import com.easter.route.global.security.PassportDto;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/maon/route")
@RequiredArgsConstructor
public class RouteController {
    private final RouteService routeService;

    @PostMapping("/course/create")
    public ResponseEntity<ResultResponse> createRoute(@RequestAttribute("passport") PassportDto passport, @RequestBody CreateRouteRequestDto createRouteRequestDto) {
        routeService.createRoute(passport, createRouteRequestDto);
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.CREATED, "경로 등록을 완료했습니다.");
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }

    @DeleteMapping("/course/delete")
    public ResponseEntity<ResultResponse> deleteRoute(@RequestAttribute("passport") PassportDto passport, @RequestBody DeleteRouteRequestDto deleteRouteRequestDto) {
        routeService.deleteRoute(passport, deleteRouteRequestDto);
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "저장된 경로를 삭제했습니다.");
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }

    @GetMapping("/course/list")
    public ResponseEntity<ResultResponse> getRouteList() {
        List<RouteDto> routeList = routeService.getRouteList();
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "경로 리스트를 조회했습니다.", routeList);
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }

    @GetMapping("/course/details")
    public ResponseEntity<ResultResponse> searchRouteByConditions(@RequestAttribute("passport") PassportDto passport,
        @RequestBody GetRouteDetailsRequestDto getRouteDetailsRequestDto) {
        List<?> routes = routeService.searchRouteByConditions(passport, getRouteDetailsRequestDto);
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "경로 상세 정보를 조회했습니다.", routes);
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }
}
