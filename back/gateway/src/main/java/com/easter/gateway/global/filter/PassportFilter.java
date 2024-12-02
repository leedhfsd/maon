package com.easter.gateway.global.filter;

import com.easter.gateway.global.exception.BusinessException;
import com.easter.gateway.global.model.ConfirmMemberResponseDto;
import com.easter.gateway.global.security.HmacProvider;
import com.easter.gateway.global.security.PassportDto;
import com.easter.gateway.global.security.Role;
import com.easter.gateway.global.security.TokenProvider;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.HmacUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.Base64;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;

@Slf4j
@RequiredArgsConstructor
public class PassportFilter implements WebFilter {

    private final TokenProvider tokenProvider;
    private final ObjectMapper objectMapper;
    private final RestClient restClient;
    private final HmacProvider hmacProvider;
    private final RedisTemplate<String, Object> redisTemplate;

    private final String KEY_PREFIX = "PASSPORT:";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        log.debug("jwt passport manager entered");
        log.info("new request reached : {}", exchange.getRequest().getURI());
//        log.info("-----headers-----");
//        for(String keys : exchange.getRequest().getHeaders().keySet()) {
//            log.info("{} : {}", keys, exchange.getRequest().getHeaders().get(keys));
//        }
//        log.info("body : {}", exchange.getRequest().getBody());
        if(exchange.getRequest().getHeaders().containsKey("passport")) {
            log.info("duplicated passport filter");
            return chain.filter(exchange);
        }
        String token = tokenProvider.getJwtTokenFromRequestHeader(exchange);
        if (token == null) {
            log.debug("this request has no token");
            return chain.filter(exchange); // 토큰이 없으므로 그대로 다음 필터로 진행
        }
        Claims claims = tokenProvider.decode(token);
        if (!claims.getExpiration().after(new Date())) { // 토큰 만료여부 체크
            throw new BusinessException(HttpStatus.UNAUTHORIZED, "토큰이 만료되었습니다. 재발급해주세요.");
        }
        String email = (String) claims.get("email");
        PassportDto passport;
        String redisKey = KEY_PREFIX + email;
        // member에 쿼리하기 전 redis를 뒤져본다
        HashOperations<String, String, Object> hps = redisTemplate.opsForHash();
        String savedToken = (String) hps.get(redisKey, "token");
        log.debug("saved token: {}", savedToken);
        if(savedToken != null && savedToken.equals(token)) {
            log.debug("found token information at redis : {}", token);
            try {
                passport = objectMapper.readValue((String) hps.get(redisKey, "passport"), PassportDto.class);
            } catch(JsonProcessingException e) {
                log.error("[Passport] JSON parsing error");
                throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "[Passport] json 역직렬화에 실패했습니다.");
            }
            redisTemplate.expire(redisKey, 10, TimeUnit.MINUTES); // 한 번 접근했다면 expire 연장
            log.debug("got passport : {}", passport.toString());
        } else {
            // 찾을 수 있었다면, passportDto에 들어갈 정보 수령
            ResponseEntity<Map> passportResult = restClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/service/confirm/" + email).queryParam("token", token).build())
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError, (request, response) -> {
                        throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "[Passport] member 서비스와 통신하지 못했습니다.");
                    })
                    .onStatus(HttpStatusCode::is5xxServerError, (request, response) -> {
                        throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "[Passport] member 서비스에서 문제가 발생했습니다.");
                    })
                    .toEntity(Map.class);
            ConfirmMemberResponseDto responseDto = objectMapper.convertValue(passportResult.getBody().get("data"), ConfirmMemberResponseDto.class);
            if(!responseDto.isValid()) {
                log.info("invalid token");
                return chain.filter(exchange);
            }
            passport = responseDto.getPassport();
            if (responseDto.isRegistered()) {
                passport.setRole(Role.REGISTERED);
            } else {
                passport.setRole(Role.UNREGISTERED);
                passport.setName((String) claims.get("name"));
                passport.setEmail(email);
                passport.setImageUrl((String) claims.get("image_url"));
            }
            // 이후 만든 passport를 redis에 등록
            hps.put(redisKey, "token", token);
            String passportJson;
            try {
                passportJson = objectMapper.writeValueAsString(passport);
            } catch (JsonProcessingException e) {
                log.error("[Passport] JSON parsing error");
                throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "[Passport] json 직렬화에 실패했습니다.");
            }
            hps.put(redisKey, "passport", passportJson);
            redisTemplate.expire(redisKey, 10, TimeUnit.MINUTES); // 10분 후 리셋
            log.info("saved passport info at redis : {}", passport);
        }
        log.debug("passport created : {}", passport.toString());
        Map<String, String> passportMap = objectMapper.convertValue(passport, Map.class);
        // encoding 이전의 값을 기준으로 hmac 시행
        String hmacValue;
        try {
            hmacValue = hmacProvider.hmac(objectMapper.writeValueAsString(passport));
        } catch (Exception e) {
            log.error("error occurred while hmac processing");
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "[Passport] hmac 과정에서 오류가 발생했습니다.");
        }
        Base64.Encoder encoder = Base64.getEncoder();
        Consumer<HttpHeaders> headersConsumer = httpHeaders -> {
            for(Map.Entry<String, String> entry : passportMap.entrySet()) {
                if(entry.getValue() != null) {
                    httpHeaders.add(entry.getKey(), encoder.encodeToString(entry.getValue().getBytes()));
                }
            }
            httpHeaders.add("passport", "confirmed");
            httpHeaders.add("passport-hmac", hmacValue);
        };
        ServerWebExchange newExchange = exchange
                .mutate()
                .request(exchange
                        .getRequest()
                        .mutate()
                        .headers(headersConsumer)
                        .build())
                .build();
        return chain.filter(newExchange);
    }
}
