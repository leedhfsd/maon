package com.easter.tournament.domain.tournament.entity;

import com.easter.tournament.domain.participant.entity.Participant;
import com.fasterxml.uuid.Generators;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.DefaultValue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Builder(toBuilder = true)
@Table(name = "tournament")
@DynamicInsert
@NoArgsConstructor
@AllArgsConstructor
public class Tournament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @NotNull
    @Column(name = "uuid", columnDefinition = "binary(16)")
    private UUID uuid;

    @NotNull
    @Column(name = "title")
    private String title;

    @NotNull
    @Column(name = "location")
    private String location;

    @NotNull
    @Column(name = "tournament_day_start")
    private LocalDateTime tournamentDayStart;

    @NotNull
    @Column(name = "tournament_day_end")
    private LocalDateTime tournamentDayEnd;

    @NotNull
    @Column(name = "closed")
    @DefaultValue(value = "false")
    private boolean closed;

    @Column(name = "homepage")
    private String homepage;

    @Column(name = "receipt_start")
    private LocalDateTime receiptStart;

    @Column(name = "receipt_end")
    private LocalDateTime receiptEnd;

    @Column(name = "host")
    private String host;

    @Column(name = "inquiry")
    private String inquiry;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @OneToMany(mappedBy = "tournament", fetch = FetchType.LAZY)
    private List<TournamentAssignment> tournamentAssignment;

    @OneToMany(mappedBy = "tournament", fetch = FetchType.LAZY)
    private List<Participant> participants;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_code_id")
    private AreaCode areaCode;

    @PrePersist
    private void prePersist() {
        this.uuid = Generators.timeBasedEpochGenerator().generate();
    }
}
