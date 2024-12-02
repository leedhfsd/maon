package com.easter.route.domain.trade.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class StartTradeDto {
    private String routeId;
    private String mode;
    private String recordId;
}
