package com.easter.tournament.domain.team.entity;

import com.fasterxml.uuid.Generators;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Builder(toBuilder = true)
@Table(name = "team_invitation")
@NoArgsConstructor
@AllArgsConstructor
public class TeamInvitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @NotNull
    @Column(name = "uuid", columnDefinition = "binary(16)", unique = true)
    private UUID uuid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", updatable = false, insertable = false)
    private Team team;

    @Column(name = "team_id")
    private Long teamId;

    @NotNull
    @Column(name = "inviter_id", columnDefinition = "binary(16)")
    private UUID inviterId;

    @NotNull
    @Column(name = "inviter_nickname", length = 30)
    private String inviterNickname;

    @Column(name = "inviter_image", length = 200)
    private String inviterImage;

    @NotNull
    @Column(name = "invitee_id", columnDefinition = "binary(16)")
    private UUID inviteeId;

    @Column(name = "valid")
    private boolean valid;

    @Column(name = "create_time")
    private LocalDateTime createTime;

    @PrePersist
    private void prePersist() {
        this.uuid = Generators.timeBasedEpochGenerator().generate();
        this.createTime = LocalDateTime.now();
    }

}
