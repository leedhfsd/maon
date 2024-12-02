package com.easter.gateway.global.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Slf4j
@Configuration
public class PostFilter {
    @Bean
    public GlobalFilter postLoggingFilter() {
        return (exchange, chain) -> {
            return chain.filter(exchange)
                    .doOnCancel(() -> {
                        log.error("Client Connection Closed at {}", LocalDateTime.now());
                    })
                    ;
        };
    }
}
