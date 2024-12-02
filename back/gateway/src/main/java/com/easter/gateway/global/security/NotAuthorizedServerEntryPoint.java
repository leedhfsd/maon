package com.easter.gateway.global.security;

import com.easter.gateway.global.exception.ErrorResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.server.ServerAuthenticationEntryPoint;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class NotAuthorizedServerEntryPoint implements ServerAuthenticationEntryPoint {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpStatus UNAUTHORIZED = HttpStatus.UNAUTHORIZED;

    @Override
    public Mono<Void> commence(ServerWebExchange exchange, AuthenticationException ex) {
        ErrorResponse errorResponse = ErrorResponse.of(UNAUTHORIZED, "인증되지 않은 요청입니다.");
        byte[] byteResponse;
        try {
            byteResponse = objectMapper.writeValueAsBytes(errorResponse);
        } catch(JsonProcessingException e) { // 프로세싱 중 에러 발생시 error code만 발행
            return Mono.fromRunnable(() -> {
                exchange.getResponse().setStatusCode(UNAUTHORIZED);
            });
        }
        DataBuffer body = exchange.getResponse().bufferFactory().wrap(byteResponse);
        exchange.getResponse().getHeaders().add("Content-Type", "application/json");
        exchange.getResponse().setStatusCode(UNAUTHORIZED);
        return exchange.getResponse().writeWith(Flux.just(body));
    }
}
