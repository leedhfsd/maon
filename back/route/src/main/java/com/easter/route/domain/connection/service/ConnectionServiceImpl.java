package com.easter.route.domain.connection.service;

import com.easter.route.domain.connection.model.ConnectionType;
import com.easter.route.domain.connection.model.dto.ConnectionResultDto;
import com.easter.route.domain.connection.model.dto.WatchConnectDto;
import com.easter.route.domain.connection.model.dto.MemberInfoDto;
import com.easter.route.domain.connection.model.dto.RelayMemberInfoDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConnectionServiceImpl implements ConnectionService {

    private final RedisTemplate<String, String> redisTemplate;
    private final String CODE_PREFIX = "CONNECTION_CODE:";

    @Override
    public void saveMemberInfo(MemberInfoDto dto, String code) {
        ValueOperations<String, String> ops = redisTemplate.opsForValue();
        String key = CODE_PREFIX + code;
        if(ops.get(key) != null) {
            log.error("already exist : {}", code);
            return;
        }
        ops.set(key + ":ID", dto.getMemberId().toString());
        ops.set(key + ":NICKNAME", dto.getMemberNickname());
        redisTemplate.expire(key + ":ID", 10, TimeUnit.MINUTES); // 코드의 유효기간은 10분
        redisTemplate.expire(key + ":NICKNAME", 10, TimeUnit.MINUTES); // 코드의 유효기간은 10분
    }

    @Override
    public ConnectionResultDto connect(String code) {
        ValueOperations<String, String> ops = redisTemplate.opsForValue();
        String key = CODE_PREFIX + code;
        String memberId = ops.get(key + ":ID");
        String memberNickname = ops.get(key + ":NICKNAME");
        if(memberId == null) {
            return ConnectionResultDto.builder()
                    .type(ConnectionType.CONNECTION_FAILED)
                    .timestamp(LocalDateTime.now())
                    .build();
        }
        return ConnectionResultDto.builder()
                .type(ConnectionType.CONNECTION_SUCCEED)
                .memberId(UUID.fromString(memberId))
                .memberNickname(memberNickname)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Override
    public WatchConnectDto connectionSuccess(String code) {
        return WatchConnectDto.builder().type(ConnectionType.CONNECTION_SUCCEED).timestamp(LocalDateTime.now()).build();
    }

    @Override
    public RelayMemberInfoDto relayMemberInfo(String code) {
        ValueOperations<String, String> ops = redisTemplate.opsForValue();
        String key = CODE_PREFIX + code;
        String memberId = ops.get(key);
        if(memberId == null) {
            log.error("cannot find member : {}", code);
            return null;
        }
        return RelayMemberInfoDto.builder()
                .type(ConnectionType.SENDING_INFORMATION)
                .memberId(UUID.fromString(memberId))
                .timestamp(LocalDateTime.now())
                .build();
    }
}
