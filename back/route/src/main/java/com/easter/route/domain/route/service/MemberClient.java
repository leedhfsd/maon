package com.easter.route.domain.route.service;

import com.easter.route.domain.route.entity.dto.GetMemberListRequestFeignDto;
import com.easter.route.global.response.ResultResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "member")
public interface MemberClient {

    @PostMapping("/maon/member/service/search")
    ResponseEntity<ResultResponse> getMemberInfoList(@RequestBody GetMemberListRequestFeignDto requestFeignDto);
}
