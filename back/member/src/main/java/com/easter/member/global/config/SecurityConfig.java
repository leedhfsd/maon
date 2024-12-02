package com.easter.member.global.config;

import com.easter.member.global.filter.PassportFilter;
import com.easter.member.global.security.HmacProvider;
import com.easter.member.global.security.handler.OAuth2SuccessHandler;
import com.easter.member.global.security.jwt.TokenProvider;
import com.easter.member.global.security.userinfo.CustomOidcUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configurers.FormLoginConfigurer;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Value("${spring.hmac.key}")
    private String hmacKey;

    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final CustomOidcUserService customOidcUserService;
    private final TokenProvider tokenProvider;
    private final HmacProvider hmacProvider;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(CsrfConfigurer::disable)
                .httpBasic(HttpBasicConfigurer::disable)
                .formLogin(FormLoginConfigurer::disable) // oauth를 위해 기본 로그인 비활성화
                .sessionManagement(c -> c.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션 사용하지 않음
                .authorizeHttpRequests(request -> request // 인증 필터링은 gateway에서 시행하므로 여기에서는 permit all
                        .anyRequest().permitAll())
                .oauth2Login(oauth2 -> oauth2
                                .authorizationEndpoint(auth -> auth.baseUri("/maon/member/member/login"))
                                .redirectionEndpoint(redirect -> redirect.baseUri("/maon/member/login/oauth2/code/*"))
                                .userInfoEndpoint(userInfo -> userInfo.oidcUserService(customOidcUserService))
                                .successHandler(oAuth2SuccessHandler)
                )
                .addFilterAfter(new PassportFilter(hmacProvider), AuthorizationFilter.class)
        ;
        return http.build();
    }
}
