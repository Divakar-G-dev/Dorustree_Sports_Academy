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

    public SportEntity addSport(SportEntity sport) {
        return sportRepo.save(sport);
    }

    public void deleteSport(Long id) {
        SportEntity sport = sportRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Sport not found with id: " + id));

        // Remove the sports from students too
        List<StudentEntity> allStudents = studentRepo.findAll();
        for (StudentEntity student : allStudents) {
            if (student.getSports().remove(sport)) {  //remove the sport if exist
                int newTotalFees = student.getSports().stream()
                        .mapToInt(SportEntity::getFees)//.mapToInt(sport -> sport.getFees())
                        .sum();
                student.setTotalFees(newTotalFees);
                studentRepo.save(student);
            }
        }

        sportRepo.delete(sport);
    }
}