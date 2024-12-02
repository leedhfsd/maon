package com.easter.member.global.security.userinfo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

import java.io.Serial;
import java.io.Serializable;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@Getter
@Builder
@AllArgsConstructor
public class CustomOidcUser implements OidcUser, Serializable {
    private PassportDto passport;
    private String nameAttributeKey;
    private Map<String, Object> attributes;
    private Collection<GrantedAuthority> authorities;

    @Serial
    private static final long serialVersionUID = 202411011341L;

    @Override
    public Map<String, Object> getClaims() {
        return attributes;
    }

    @Override
    public OidcUserInfo getUserInfo() {
        return new OidcUserInfo(attributes);
    }

    @Override
    public OidcIdToken getIdToken() {
        return null;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getName() {
        return passport.getEmail();
    }
}
