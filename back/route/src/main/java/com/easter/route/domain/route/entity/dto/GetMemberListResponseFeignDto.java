package com.easter.route.domain.route.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GetMemberListResponseFeignDto {
    private List<MemberInfo> memberInfoList;
}
