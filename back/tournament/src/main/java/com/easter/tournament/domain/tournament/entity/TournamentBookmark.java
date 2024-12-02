package com.easter.tournament.domain.tournament.entity;

import com.fasterxml.uuid.Generators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.rmi.server.UID;
import java.util.UUID;

@Entity
@Getter
@Table(name = "tournament_bookmark")
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class TournamentBookmark {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "uuid", columnDefinition = "binary(16)")
    private UUID uuid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", updatable = false, insertable = false)
    private Tournament tournament;

    @Column(name = "tournament_id")
    private Long tournamentId;

    @Column(name = "member_id", columnDefinition = "binary(16)")
    private UUID memberId;

    @PrePersist
    private void prePersist() {
        this.uuid = Generators.timeBasedEpochGenerator().generate();
    }
}
