package com.easter.tournament.domain.tournament.entity;

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
@Table(name = "tournament_category")
@AllArgsConstructor
@NoArgsConstructor
public class TournamentCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @NotNull
    @Column(name = "uuid", columnDefinition = "binary(16)")
    private UUID uuid;

    @NotNull
    @Column(name = "category_value")
    private String categoryValue;

    @OneToMany( mappedBy = "category", fetch = FetchType.LAZY)
    private List<TournamentAssignment> tournamentAssignment;

    @PrePersist
    private void prePersist() {
        this.uuid = Generators.timeBasedEpochGenerator().generate();
    }
}
