package com.example.dorustreesportsacademy.repository;

import com.example.dorustreesportsacademy.entity.SportEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SportRepository extends JpaRepository<SportEntity, Long> {
    Optional<SportEntity> findByName(String name);
}
