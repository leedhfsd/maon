package com.easter.route.domain.record.controller;

import java.util.List;

import com.easter.route.domain.record.entity.Record;
import com.easter.route.domain.record.entity.dto.CreateRunningResponseDto;
import com.easter.route.domain.record.entity.dto.GetMyRecordsResponseDto;
import com.easter.route.domain.record.entity.dto.RecordDto;
import com.easter.route.domain.record.service.RecordService;
import com.easter.route.domain.record.entity.dto.CreateRunningRequestDto;
import com.easter.route.global.response.ResultResponse;
import com.easter.route.global.security.PassportDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/maon/route")
@Slf4j
public class RecordController {

    private final RecordService recordService;

    @PostMapping("/running/createRunning")
    public ResponseEntity<ResultResponse> createRunning(@RequestAttribute("passport") PassportDto passport, @RequestBody CreateRunningRequestDto createRunningRequestDto) {
        log.info("passport : {}", passport);
        CreateRunningResponseDto responseDto = recordService.createRunning(passport.getId(), createRunningRequestDto);
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.CREATED, "Record를 생성했습니다.", responseDto);
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }

    @GetMapping("/record/myRecords")
    public ResponseEntity<ResultResponse> getMyRecords(@RequestAttribute("passport") PassportDto passport) {
        List<GetMyRecordsResponseDto> recordList = recordService.getRecordListByMemberId(passport.getId().toString());
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "Record 리스트를 가져왔습니다.", recordList);
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }
}