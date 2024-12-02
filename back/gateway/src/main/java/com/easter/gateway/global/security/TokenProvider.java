package com.easter.gateway.global.security;

import com.easter.gateway.global.exception.BusinessException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ServerWebExchange;

import javax.crypto.Mac;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

//@RequiredArgsConstructor
@Component
@Slf4j
public class TokenProvider {
    @Value("${spring.jwt.secret}")
    private String key;

    @Value("${spring.jwt.token.access-expiration-time}")
    private long accessExpirationTime;

    @Value("${spring.jwt.token.refresh-expiration-time}")
    private long refreshExpirationTime;

    private SecretKey secretKey;

    @PostConstruct
    private void setSecretKey() {
        secretKey = Keys.hmacShaKeyFor(key.getBytes());
    }

    public Claims decode(String token) {
        // todo : 각종 exception 처리
        try {
            return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload();
        }
        catch(ExpiredJwtException ex) {
            throw new BusinessException(HttpStatus.UNAUTHORIZED, "토큰이 만료되었습니다. 재발급해주세요.");
        }
    }

//    public Authentication getAuthentication(String token) {
//        Claims claims = decode(token);
//        List<SimpleGrantedAuthority> authorities = getAuthorities(claims);
//        User principal = new User((String) claims.get("name"), "", authorities);
//        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
//    }

    //header에서 Access Bearer 토큰 가져오기
    public String getJwtTokenFromRequestHeader(ServerWebExchange exchange) {
        ServerHttpRequest request = exchange.getRequest();
        String bearerToken = request.getHeaders().getFirst("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    /* 유효성 검사 관련 */
    public boolean validateToken(String token) {
        if (!StringUtils.hasText(token)) {
            return false;
        }
        Claims claims = decode(token);
        return claims.getExpiration().after(new Date());
    }

    private List<SimpleGrantedAuthority> getAuthorities(Claims claims) {
        return Collections.singletonList(new SimpleGrantedAuthority(
                claims.get("role").toString()));
    }

}
