package com.easter.route.domain.record.service;

import java.util.List;
import java.util.UUID;

import com.easter.route.domain.record.entity.Record;
import com.easter.route.domain.record.entity.dto.CreateRunningResponseDto;
import com.easter.route.domain.record.entity.dto.GetMyRecordsResponseDto;
import com.easter.route.domain.record.entity.dto.RecordDto;
import com.easter.route.domain.record.entity.dto.UpdateRecordDto;
import com.easter.route.domain.record.entity.dto.CreateRunningRequestDto;
import com.easter.route.global.security.PassportDto;

public interface RecordService {
    CreateRunningResponseDto createRunning(UUID memberId, CreateRunningRequestDto createRunningRequestDto);
    Record updateRecord(UpdateRecordDto updateRecordDto);
    List<GetMyRecordsResponseDto> getRecordListByMemberId(String memberId);
}
