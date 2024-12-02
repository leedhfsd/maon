package com.easter.tournament.domain.tournament.model.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GetMarathonRequestDto {
    private int year;
    private int month;
    private int area;
    private boolean closed;
}
