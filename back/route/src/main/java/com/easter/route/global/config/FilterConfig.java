package com.easter.route.global.config;

import com.easter.route.global.security.HmacProvider;
import com.easter.route.global.security.PassportFilter;
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
