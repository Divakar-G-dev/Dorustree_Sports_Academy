package com.example.dorustreesportsacademy.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(
        name = "students",
        uniqueConstraints = { @UniqueConstraint(columnNames = "phone"), @UniqueConstraint(columnNames = "email") } // email unique
)
public class StudentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentId;

    @NotBlank(message = "First name is mandatory")
    @Size(min = 3, message = "First name must be at least 3 characters")
    private String firstName;

    @NotBlank(message = "Last name is mandatory")
    @Size(min = 1, message = "Last name must be at least 1 characters")
    private String lastName;

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email should be valid")
    @Column(unique = true)
    private String email;                   // <-- added email

    @NotBlank(message = "Parent name is mandatory")
    private String parentName;

    @NotBlank(message = "Phone is mandatory")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be exactly 10 digits")
    @Column(unique = true)
    private String phone;

    @NotBlank(message = "Emergency contact is mandatory")
    @Pattern(regexp = "^[0-9]{10}$", message = "Emergency contact must be exactly 10 digits")
    private String emergencyContact;

    @NotNull(message = "DOB is mandatory")
    @Past(message = "DOB must be a valid past date")
    private LocalDate dob;

    @NotBlank(message = "Password is mandatory")
    private String password;

    @NotBlank(message = "Role is mandatory")
    private String role; // "Student" or "Admin"

    @ManyToMany
    @JoinTable(
            name = "student_sports",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "sport_id")
    )
    private Set<SportEntity> sports = new HashSet<>();

    private Integer totalFees;
}
