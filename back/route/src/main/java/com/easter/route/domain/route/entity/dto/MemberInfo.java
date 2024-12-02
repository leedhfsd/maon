package com.easter.route.domain.route.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class MemberInfo {
    private UUID memberId;
    private String name;
    private String nickname;
    private String email;
    private String imageUrl;
}
