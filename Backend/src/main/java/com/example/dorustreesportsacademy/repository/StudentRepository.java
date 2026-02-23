package com.example.dorustreesportsacademy.repository;

import com.example.dorustreesportsacademy.entity.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<StudentEntity, Long> {
    // ADD this method:
    Optional<StudentEntity> findByEmail(String email);

}
