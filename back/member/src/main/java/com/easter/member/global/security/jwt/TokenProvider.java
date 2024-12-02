package com.easter.member.global.security.jwt;

import com.easter.member.global.exception.BusinessException;
import com.easter.member.global.security.userinfo.CustomOidcUser;
import com.easter.member.global.security.userinfo.PassportDto;
import com.easter.member.global.security.userinfo.Role;
import com.easter.member.global.security.userinfo.TokenType;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecureDigestAlgorithm;
import io.jsonwebtoken.security.SignatureAlgorithm;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.crypto.Mac;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
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

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @PostConstruct
    private void setSecretKey() {
        secretKey = Keys.hmacShaKeyFor(key.getBytes());
    }

    private String generateToken(PassportDto passport, long expireTime, TokenType type) {
        Date now = new Date();
        Date expiredDate = new Date(now.getTime() + expireTime);

        log.info("passport : {}", passport.toString());
        String generatedToken = Jwts.builder()
//                .subject(authentication.getName())
                .claim("type", type.name())
                .claim("email", passport.getEmail())
                .claim("name", passport.getName())
                .claim("image_url", passport.getImageUrl())
                .claim("role", passport.getRole().name())
                .issuedAt(now)
                .expiration(expiredDate)
                .signWith(secretKey, Jwts.SIG.HS512)
                .compact();
        // 토큰 생성 후 redis에 저장
        String redisKey = type.name()+":" + passport.getEmail();
        redisTemplate.opsForValue().set(
                redisKey,
                generatedToken,
                expireTime,
                TimeUnit.MILLISECONDS
        );
        return generatedToken;
    }

    public String generateAccessToken(PassportDto passport) {
        return generateToken(passport, accessExpirationTime, TokenType.ACCESS);
    }

    public String generateRefreshToken(PassportDto passport) {
        return generateToken(passport, refreshExpirationTime, TokenType.REFRESH);
    }

    public String getTokenByEmail(String email, TokenType type) {
        return redisTemplate.opsForValue().get(type.name() + ":" + email);
    }

    public String reissueToken(String refreshToken) {
        Claims claims;
        try {
            claims = decode(refreshToken);
            if(!claims.getExpiration().after(new Date())) {
                throw new BusinessException(HttpStatus.UNAUTHORIZED, "만료된 리프레쉬 토큰입니다. 다시 로그인해주세요.");
            }
        } catch(ExpiredJwtException e) {
            log.error("expired refresh token : {}", refreshToken);
            throw new BusinessException(HttpStatus.UNAUTHORIZED, "만료된 리프레쉬 토큰입니다. 다시 로그인해주세요.");
        } catch(Exception e) {
            log.error("this refresh token has some problems : {}", refreshToken);
            throw new BusinessException(HttpStatus.UNAUTHORIZED, "리프레쉬 토큰에 문제가 있습니다.");
        }
        String email = claims.get("email", String.class);
        String foundToken = getTokenByEmail(email, TokenType.REFRESH);
        if(!foundToken.equals(refreshToken)) {
            throw new BusinessException(HttpStatus.UNAUTHORIZED, "서버에 등록되지 않은 토큰입니다.");
        }
        // refresh token 검증이 끝났다면 access token 재발급 시행
        PassportDto passport = PassportDto.builder()
                .email(email)
                .name(claims.get("name", String.class))
                .imageUrl(claims.get("image_url", String.class))
                .role(Role.valueOf(claims.get("role", String.class)))
                .build();
        return generateAccessToken(passport);
    }

    public Claims decode(String token) {
        // todo : 각종 exception 처리
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload();
    }

    public boolean removeToken(String email) {
        // refresh, access 전부 제거
        return redisTemplate.delete(TokenType.ACCESS.name() + ":" + email) && redisTemplate.delete(TokenType.REFRESH.name() + ":" + email);
    }

}
