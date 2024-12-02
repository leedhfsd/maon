package com.easter.tournament.global.exception;

import lombok.Builder;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@Builder
public class ErrorResponse {
    private final HttpStatus status;
    private final String message;

    public static ErrorResponse of(HttpStatus status, String message) {
        return ErrorResponse.builder()
                .status(status)
                .message(message)
                .build();
    }
}
