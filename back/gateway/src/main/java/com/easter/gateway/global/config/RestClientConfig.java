package com.easter.gateway.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Value("${external-url.member}")
    private String memberUrl;

    @Bean
    public RestClient restClient() {
        return RestClient.builder()
                .baseUrl(memberUrl)
                .build();
    }

}
