package com.easter.member.domain.service.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Getter
@NoArgsConstructor
public class SearchMemberRequestDto {
    private List<UUID> idList;
    private String nicknameKeyword;
}
