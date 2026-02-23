package com.example.dorustreesportsacademy.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
@Entity
@Table(name = "sports")
public class SportEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Sport name is mandatory")
    @Column(unique = true)
    private String name;

    @Positive(message = "Fees must be positive")
    private Integer fees;

    @NotBlank(message = "Timing is mandatory")
    private String timing;
}
