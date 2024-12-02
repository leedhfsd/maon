package com.easter.member.domain.service.service;

import com.easter.member.domain.service.model.dto.ConfirmMemberResponseDto;
import com.easter.member.domain.service.model.dto.SearchMemberRequestDto;
import com.easter.member.domain.service.model.dto.SearchMemberResponseDto;

import java.util.List;

public interface ServiceService {
    ConfirmMemberResponseDto confirmMember(String email, String Token);
    SearchMemberResponseDto searchMember(SearchMemberRequestDto dto);
}
