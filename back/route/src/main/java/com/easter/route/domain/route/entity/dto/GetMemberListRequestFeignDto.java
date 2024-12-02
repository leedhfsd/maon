package com.easter.route.domain.route.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GetMemberListRequestFeignDto {
    private List<UUID> idList;
    private String nicknameKeyword;
}
