package com.easter.member.global.security.handler;

import com.easter.member.global.security.jwt.TokenProvider;
import com.easter.member.global.security.userinfo.CustomOidcUser;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@Slf4j
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Value("${external-url.login-test}")
    private String loginTestUrl;

    private final TokenProvider tokenProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        log.info("authentication succeed - success handler");
        CustomOidcUser user = (CustomOidcUser) authentication.getPrincipal();
        // todo : jwt token 만들어서 보내기
        String accessToken = tokenProvider.generateAccessToken(user.getPassport());
        String refreshToken = tokenProvider.generateRefreshToken(user.getPassport());
        response.addHeader("accessToken", accessToken);
        response.addHeader("refreshToken", refreshToken);
        log.info("access token : {}, refresh token : {}", accessToken, refreshToken);
        String redirectUrl = UriComponentsBuilder.fromUriString(loginTestUrl)
                .queryParam("token", accessToken)
//                .queryParam("refreshToken", refreshToken)
                .build().toUriString();
        response.sendRedirect(redirectUrl);
    }

}
