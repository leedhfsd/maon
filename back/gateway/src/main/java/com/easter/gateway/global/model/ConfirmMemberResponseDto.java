package com.easter.gateway.global.model;

import com.easter.gateway.global.security.PassportDto;
import lombok.*;

@Getter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ConfirmMemberResponseDto {
    private boolean registered;
    private boolean valid;
    private PassportDto passport;
}
