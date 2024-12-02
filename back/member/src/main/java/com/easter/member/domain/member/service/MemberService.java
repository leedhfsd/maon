package com.easter.member.domain.member.service;

import com.easter.member.domain.member.model.dto.*;
import com.easter.member.global.security.userinfo.PassportDto;

public interface MemberService {
    LoginResponseDto login(LoginRequestDto dto);
    RegisterMemberResponseDto registerMember(PassportDto passport, RegisterMemberRequestDto dto);
    ReissueTokenResponseDto reissueToken(ReissueTokenRequestDto dto);
    void logout(String email);
    UpdateMemberResponseDto updateMember(PassportDto passport, UpdateMemberRequestDto dto);
    CheckRedundancyResponseDto checkRedundancy(CheckRedundancyRequestDto dto);
    GetMemberInfoResponseDto getMyInfo(PassportDto passport);
    void saveFcmToken(PassportDto passport, SaveFcmTokenRequestDto dto);
    GetFcmTokenResponseDto getFcmToken(PassportDto passport);
}
