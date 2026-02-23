package com.example.dorustreesportsacademy.service;

import com.example.dorustreesportsacademy.entity.SportEntity;
import com.example.dorustreesportsacademy.entity.StudentEntity;
import com.example.dorustreesportsacademy.repository.SportRepository;
import com.example.dorustreesportsacademy.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SportService {

    private final SportRepository sportRepo;
    private final StudentRepository studentRepo;

    public SportService(SportRepository sportRepo, StudentRepository studentRepo) {
        this.sportRepo = sportRepo;
        this.studentRepo = studentRepo;
    }

    public List<SportEntity> getAllSports() {
        return sportRepo.findAll();
    }

    // ✅ VALIDATE: Prevent duplicate timings
    public SportEntity addSport(SportEntity sport) {
        // Check if timing already exists
        List<SportEntity> existingSports = sportRepo.findAll();
        for (SportEntity existing : existingSports) {
            if (existing.getTiming().equals(sport.getTiming())) {
                throw new RuntimeException("Timing " + sport.getTiming() + " already exists for " + existing.getName());
            }
        }
        return sportRepo.save(sport);
    }

    public void deleteSport(Long id) {
        SportEntity sport = sportRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Sport not found with id: " + id));


        List<StudentEntity> allStudents = studentRepo.findAll();
        for (StudentEntity student : allStudents) {
            if (student.getSports().remove(sport)) {
                int newTotalFees = student.getSports().stream()
                        .mapToInt(SportEntity::getFees)
                        .sum();
                student.setTotalFees(newTotalFees);
                studentRepo.save(student);
            }
        }

        sportRepo.delete(sport);
    }
}
