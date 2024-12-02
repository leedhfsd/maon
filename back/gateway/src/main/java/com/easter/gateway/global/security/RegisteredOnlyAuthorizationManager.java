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

import java.util.Base64;

@Slf4j
@Component
@RequiredArgsConstructor
public class RegisteredOnlyAuthorizationManager implements ReactiveAuthorizationManager<AuthorizationContext> {

    @Override
    public Mono<AuthorizationDecision> check(Mono supplier, AuthorizationContext context) { // 헤더 뜯어서 값 존재하는지만 검사
        ServerWebExchange exchange = context.getExchange();
        log.debug("jwt custom authorization manager entered");
        HttpHeaders headers = exchange.getRequest().getHeaders();
        if(!headers.containsKey(HttpHeaders.AUTHORIZATION)) {
            // jwt가 아예 없었던 경우 무조건 거절
            log.error("unauthorized request -> Access Denied");
            return Mono.just(new AuthorizationDecision(false));
        }
        Role role = Role.valueOf(new String(Base64.getDecoder().decode(headers.getFirst("role"))));
        if(headers.containsKey("passport") && role == Role.REGISTERED) {
            log.debug("registered member,  jwt : {}", headers.get(HttpHeaders.AUTHORIZATION));
            return Mono.just(new AuthorizationDecision(true));
        } else {
            log.error("invalid request or unregistered member -> Access Denied");
            return Mono.just(new AuthorizationDecision(false));
        }
    }
}
