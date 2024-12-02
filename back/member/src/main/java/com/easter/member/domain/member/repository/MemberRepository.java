package com.easter.member.domain.member.repository;

import com.easter.member.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    <S extends Member> S save(S s);
    Optional<Member> findByEmail(String email);
    boolean existsByNickname(String nickname);
}
