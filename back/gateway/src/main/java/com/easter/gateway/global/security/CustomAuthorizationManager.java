package com.easter.gateway.global.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.ReactiveAuthorizationManager;
import org.springframework.security.web.server.authorization.AuthorizationContext;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomAuthorizationManager implements ReactiveAuthorizationManager<AuthorizationContext> {

    @Override
    public Mono<AuthorizationDecision> check(Mono supplier, AuthorizationContext context) { // 헤더 뜯어서 값 존재하는지만 검사
        ServerWebExchange exchange = context.getExchange();
        log.debug("jwt custom authorization manager entered");
        HttpHeaders headers = exchange.getRequest().getHeaders();
        if(!headers.containsKey(HttpHeaders.AUTHORIZATION)) { // jwt가 포함되지 않은 요청의 경우 무조건 돌려보냄
            log.error("unauthorized request");
            return Mono.just(new AuthorizationDecision(false));
        }
        if(headers.containsKey("passport")) {
            log.debug("valid jwt : {}", headers.get(HttpHeaders.AUTHORIZATION));
            return Mono.just(new AuthorizationDecision(true));
        } else {
            log.error("invalid request -> Access Denied");
            return Mono.just(new AuthorizationDecision(false));
        }
    }
}
