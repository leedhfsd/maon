package com.easter.tournament.domain.participant.entity;

import com.easter.tournament.domain.team.entity.Team;
import com.easter.tournament.domain.tournament.entity.Tournament;
import com.easter.tournament.domain.participant.model.ParticipantStatus;
import com.fasterxml.uuid.Generators;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@ToString
@Builder(toBuilder = true)
@Table(name = "participant")
@NoArgsConstructor
@AllArgsConstructor
public class Participant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @NotNull
    @Column(name = "uuid", columnDefinition = "binary(16)")
    private UUID uuid;

    @NotNull
    @Column(name = "member_id", columnDefinition = "binary(16)")
    private UUID memberId;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ParticipantStatus status;

    @NotNull
    @Column(name = "tournament_category")
    private String tournamentCategory;

    @NotNull
    @Column(name = "create_time")
    private LocalDateTime createTime;

    @NotNull
    @Column(name = "update_time")
    private LocalDateTime updateTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", insertable = false, updatable = false)
    private Tournament tournament;

    @NotNull
    @Column(name = "tournament_id")
    private Long tournamentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", insertable = false, updatable = false)
    private Team team;

    @Column(name = "team_id")
    private Long teamId;

    @PrePersist
    private void prePersist() {
        this.uuid = Generators.timeBasedEpochGenerator().generate();
        this.createTime = LocalDateTime.now();
        this.updateTime = LocalDateTime.now();
    }

    @PreUpdate
    private void preUpdate() {
        this.updateTime = LocalDateTime.now();
    }

}
