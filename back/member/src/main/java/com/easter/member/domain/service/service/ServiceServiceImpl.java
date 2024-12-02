package com.easter.member.domain.service.service;

import com.easter.member.domain.member.entity.Member;
import com.easter.member.domain.member.repository.MemberQueryRepository;
import com.easter.member.domain.member.repository.MemberRepository;
import com.easter.member.domain.service.model.dto.ConfirmMemberResponseDto;
import com.easter.member.domain.service.model.dto.MemberDto;
import com.easter.member.domain.service.model.dto.SearchMemberRequestDto;
import com.easter.member.domain.service.model.dto.SearchMemberResponseDto;
import com.easter.member.global.security.jwt.TokenProvider;
import com.easter.member.global.security.userinfo.PassportDto;
import com.easter.member.global.security.userinfo.TokenType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ServiceServiceImpl implements ServiceService{

    private final MemberRepository memberRepository;
    private final MemberQueryRepository memberQueryRepository;
    private final TokenProvider tokenProvider;

    @Override
    public ConfirmMemberResponseDto confirmMember(String email, String token) {
        Optional<Member> optionalMember = memberRepository.findByEmail(email);
        PassportDto passport;
        // 우선 token의 유효성 검사
        String foundToken = tokenProvider.getTokenByEmail(email, TokenType.ACCESS);
        if(foundToken == null || !foundToken.equals(token)) {
            log.error("invalid access token");
            return ConfirmMemberResponseDto.builder()
                    .registered(false)
                    .valid(false)
                    .build();
        }
        if (optionalMember.isPresent()) {
            // 찾는데에 성공했다면 정보를 담는다
            Member member = optionalMember.get();
            log.debug("found member : {}", email);
            passport = PassportDto.builder()
                    .id(member.getUuid())
                    .name(member.getName())
                    .nickname(member.getNickname())
                    .email(member.getEmail())
                    .imageUrl(member.getImageUrl())
                    .build();
        } else {
            log.info("unfounded member : {}", email);
            passport = PassportDto.builder()
                    .email(email)
                    .build();
        }
        return ConfirmMemberResponseDto.builder()
                .registered(optionalMember.isPresent())
                .valid(true)
                .passport(passport)
                .build();
    }

    @Override
    public SearchMemberResponseDto searchMember(SearchMemberRequestDto dto) {
        List<MemberDto> memberInfoList = memberQueryRepository.findMemberInfoByUuid(dto.getIdList(), dto.getNicknameKeyword());
        log.info("got member info : {}", memberInfoList.size());
        for(MemberDto memberDto : memberInfoList) {
            log.info(memberDto.toString());
        }
        return SearchMemberResponseDto.builder()
                .memberInfoList(memberInfoList)
                .build();
    }
}
