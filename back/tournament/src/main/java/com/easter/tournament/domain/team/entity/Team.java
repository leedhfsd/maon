package com.easter.tournament.domain.team.entity;

import com.easter.tournament.domain.participant.entity.Participant;
import com.easter.tournament.domain.tournament.entity.Tournament;
import com.fasterxml.uuid.Generators;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Builder(toBuilder = true)
@Table(name = "team")
@NoArgsConstructor
@AllArgsConstructor
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @NotNull
    @Column(name = "uuid", columnDefinition = "binary(16)", unique = true)
    private UUID uuid;

    @NotNull
    @Column(name = "name")
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", insertable = false, updatable = false)
    private Tournament tournament;

    @Column(name = "tournament_id")
    private long tournamentId;

    @OneToMany(mappedBy = "team", fetch = FetchType.LAZY)
    private List<Participant> participants;

    @PrePersist
    private void prePersist() {
        this.uuid = Generators.timeBasedEpochGenerator().generate();
    }
}
