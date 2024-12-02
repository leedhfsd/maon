package com.easter.tournament.domain.tournament.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "area_code")
public class AreaCode {

    // 일부러 AutoGenerate 안넣었어요
    @Id
    private long id;

    @NotNull
    @Column(name = "name")
    private String name;

}
