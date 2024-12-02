package com.easter.member.global.security.userinfo;

import com.easter.member.domain.member.entity.Member;
import com.easter.member.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class CustomOidcUserService implements OAuth2UserService<OidcUserRequest, OidcUser> {

    private final MemberRepository memberRepository;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("custom oidc user service entered");
        OAuth2UserService<OidcUserRequest, OidcUser> delegate = new OidcUserService();
        OidcUser oidcUser = delegate.loadUser(userRequest);
        // oauth 로그인시 부여되는 고유 키
        String oauthKey = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();
        Map<String, Object> attributes = oidcUser.getAttributes(); // 소셜 로그인 이후 전달받은 정보들 저장
        PassportDto passport;
        String email = (String) attributes.get("email");
        Optional<Member> member = memberRepository.findByEmail(email);
        if(member.isPresent()) {
            // 이미 존재하는 회원이었다면 적당한 role과 passport 부여
            Member memberInfo = member.get();
            passport = PassportDto.builder()
                    .id(memberInfo.getUuid())
                    .name(memberInfo.getName())
                    .nickname(memberInfo.getNickname())
                    .email(memberInfo.getEmail())
                    .imageUrl(memberInfo.getImageUrl())
                    .role(Role.REGISTERED)
                    .build();
            return CustomOidcUser.builder()
                    .passport(passport)
                    .attributes(attributes)
                    .nameAttributeKey(oauthKey)
                    .authorities(Collections.singletonList(new SimpleGrantedAuthority(Role.REGISTERED.name())))
                    .build();
        }
        // 존재하지 않는 회원이라면 passport 정보를 적당히 채운 후 return
        passport = PassportDto.builder()
                .id(null)
                .name((String)attributes.get("name"))
                .nickname("")
                .email(email)
                .imageUrl((String)attributes.get("picture"))
                .role(Role.UNREGISTERED)
                .build();
        return CustomOidcUser.builder()
                .passport(passport)
                .attributes(attributes)
                .nameAttributeKey(oauthKey)
                .authorities(Collections.singletonList(new SimpleGrantedAuthority(Role.UNREGISTERED.name())))
                .build();
    }
}
