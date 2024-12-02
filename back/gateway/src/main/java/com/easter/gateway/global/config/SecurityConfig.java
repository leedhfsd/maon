package com.easter.gateway.global.config;

import com.easter.gateway.global.filter.PassportFilter;
import com.easter.gateway.global.security.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;
import org.springframework.security.web.server.util.matcher.PathPatternParserServerWebExchangeMatcher;
import org.springframework.web.client.RestClient;

@Configuration
@EnableWebFluxSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Value("${spring.hmac.key}")
    private String hmacKey;

    private final CustomAuthorizationManager customAuthorizationManager;
    private final RegisteredOnlyAuthorizationManager registeredOnlyAuthorizationManager;
    private final TokenProvider tokenProvider;
    private final ObjectMapper objectMapper;
    private final RestClient restClient;
    private final HmacProvider hmacProvider;
    private final RedisTemplate<String, Object> redisTemplate;

    @Bean
    public SecurityWebFilterChain filterChain(ServerHttpSecurity http) throws Exception {
        http
                .securityMatcher(new PathPatternParserServerWebExchangeMatcher("/maon/**"))
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable) // oauth를 위해 기본 로그인 비활성화
                .authorizeExchange(exchanges -> exchanges
                                .pathMatchers("/favicon.ico", "/error").permitAll()
                                .pathMatchers("/maon/member/member/login/**", "/maon/member/login/**", "/maon/member/member/oauth2/**", "/maon/member/service/**", "/maon/member/member/logindone" ,"/maon/route/ranking/updateAllRankingList", "/maon/route/ranking/init").permitAll()
                                .pathMatchers("/maon/route/ws/location/**").permitAll() // websocket 관련
                                .pathMatchers("/maon/member/member/reissue").permitAll()
                                .pathMatchers("/maon/member/member/info", "/maon/member/member/logout", "/maon/member/member/check").access(customAuthorizationManager)
//                        .pathMatchers("/maon/member/**").access(customAuthorizationManager)
//                        .anyExchange().permitAll()
                                .anyExchange().access(registeredOnlyAuthorizationManager)
                )
                .securityContextRepository(NoOpServerSecurityContextRepository.getInstance())
                .exceptionHandling(ex -> ex.authenticationEntryPoint(new NotAuthorizedServerEntryPoint()))
                .addFilterBefore(new PassportFilter(tokenProvider, objectMapper, restClient, hmacProvider, redisTemplate), SecurityWebFiltersOrder.AUTHORIZATION)
        ;
        return http.build();
    }
}
