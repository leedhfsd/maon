package com.easter.member.domain.member.entity;

import com.easter.member.domain.member.model.Gender;
import com.fasterxml.uuid.Generators;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@ToString
@Builder(toBuilder = true)
@Table(name = "member")
@NoArgsConstructor
@AllArgsConstructor
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "uuid", columnDefinition = "binary(16)", unique = true)
    private UUID uuid;

    @NotNull
    @Column(name = "name", length = 30)
    private String name;

    @NotNull
    @Column(name = "nickname", length = 40, unique = true)
    private String nickname;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @NotNull
    @Column(name = "email", length = 40, updatable = false)
    private String email;

    @Column(name = "height")
    private Integer height;

    @Column(name = "weight")
    private Integer weight;

    @Column(name = "birth_date", columnDefinition = "Date")
    private LocalDate birthDate;

    @Column(name = "address", length = 50)
    private String address;

    @Column(name = "phone_number", length = 15)
    private String phoneNumber;

    @Column(name = "image_url", length = 200)
    private String imageUrl;

    @Column(name = "phase_average") // 초 단위로 기록
    private long phaseAverage;

    @Column(name = "total_distance") // km 단위로 기록
    private double totalDistance;

    @Column(name = "total_time", columnDefinition = "Time")
    private Time totalTime;

    @Column(name = "total_calories")
    private double totalCalories;

    @Column(name = "fcm_token", length = 300)
    private String fcmToken;

    @Column(name = "create_time")
    private LocalDateTime createTime;

    @Column(name = "update_time")
    private LocalDateTime updateTime;

    @PrePersist
    private void prePersist() {
        this.uuid = Generators.timeBasedEpochGenerator().generate();
        LocalDateTime now = LocalDateTime.now();
        this.createTime = now;
        this.updateTime = now;
    }

    @PreUpdate
    private void preUpdate() {
        this.updateTime = LocalDateTime.now();
    }
}
