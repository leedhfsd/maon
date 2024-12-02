package com.easter.route.domain.connection.service;

import com.easter.route.domain.connection.model.dto.ConnectionResultDto;
import com.easter.route.domain.connection.model.dto.WatchConnectDto;
import com.easter.route.domain.connection.model.dto.MemberInfoDto;
import com.easter.route.domain.connection.model.dto.RelayMemberInfoDto;

public interface ConnectionService {
    void saveMemberInfo(MemberInfoDto dto, String code);
    ConnectionResultDto connect(String code);
    WatchConnectDto connectionSuccess(String code);
    RelayMemberInfoDto relayMemberInfo(String code);
}