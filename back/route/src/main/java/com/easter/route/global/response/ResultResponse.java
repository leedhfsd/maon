package com.easter.route.global.response;

import org.springframework.http.HttpStatus;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResultResponse {

	private final HttpStatus status;
	private final String message;
	private final Object data;

	public static ResultResponse of(HttpStatus status, String message, Object data) {
		return ResultResponse.builder()
			.status(status)
			.message(message)
			.data(data)
			.build();
	}

	public static ResultResponse of(HttpStatus status, String message) {
		return ResultResponse.builder()
			.status(status)
			.message(message)
			.build();
	}
}
