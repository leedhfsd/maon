package com.easter.tournament.global.config;

import com.easter.tournament.global.security.HmacProvider;
import com.easter.tournament.global.security.PassportFilter;
import jakarta.servlet.Filter;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class FilterConfig {

    private final HmacProvider hmacProvider;

    @Bean
    public FilterRegistrationBean<Filter> filterRegistrationBean() {
        FilterRegistrationBean<Filter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new PassportFilter(hmacProvider));
        registrationBean.addUrlPatterns("/*");
        return registrationBean;
    }
}