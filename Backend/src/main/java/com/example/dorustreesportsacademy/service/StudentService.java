package com.example.dorustreesportsacademy.service;

import com.example.dorustreesportsacademy.dto.StudentDTO;
import com.example.dorustreesportsacademy.entity.StudentEntity;
import com.example.dorustreesportsacademy.entity.SportEntity;
import com.example.dorustreesportsacademy.repository.StudentRepository;
import com.example.dorustreesportsacademy.repository.SportRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepo;
    private final SportRepository sportRepo;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public StudentService(StudentRepository studentRepo, SportRepository sportRepo) {
        this.studentRepo = studentRepo;
        this.sportRepo = sportRepo;
    }

    private void validateNoTimeConflicts(Set<SportEntity> selectedSports) {
        if (selectedSports.isEmpty()) return;

        Map<String, List<String>> timingToSports = new HashMap<>();
        for (SportEntity sport : selectedSports) {
            String timing = sport.getTiming();
            timingToSports.computeIfAbsent(timing, k -> new ArrayList<>()).add(sport.getName());
        }

        List<String> conflicts = timingToSports.entrySet().stream()
                .filter(entry -> entry.getValue().size() > 1)
                .map(entry -> entry.getKey() + ": " + entry.getValue())
                .collect(Collectors.toList());

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("❌ Time conflicts:\n" + String.join("\n", conflicts));
        }
    }

    public StudentEntity registerStudent(StudentEntity student, Set<Long> sportIds) {
        if (sportIds == null || sportIds.isEmpty()) {
            throw new RuntimeException("At least one sport must be selected");
        }

        // HASH THE PASSWORD ON REGISTRATION
        if (student.getPassword() != null && !student.getPassword().startsWith("$2a$")) {
            student.setPassword(encoder.encode(student.getPassword()));
        }

        Set<SportEntity> sports = new HashSet<>();
        int totalFees = 0;

        for (Long id : sportIds) {
            SportEntity sport = sportRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Sport not found: " + id));
            sports.add(sport);
            totalFees += sport.getFees();
        }

        validateNoTimeConflicts(sports);
        student.setSports(sports);
        student.setTotalFees(totalFees);
        return studentRepo.save(student);
    }

    public List<StudentEntity> getAllStudents() {
        return studentRepo.findAll();
    }

    public void deleteStudent(long id) {
        if (!studentRepo.existsById(id)) {
            throw new RuntimeException("Student not found: " + id);
        }
        studentRepo.deleteById(id);
    }

    public void deleteAllStudent() {
        studentRepo.deleteAll();
    }

    public void updateStudent(Long id, StudentDTO dto) {
        StudentEntity existingStudent = studentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (dto.getFirstName() != null) existingStudent.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) existingStudent.setLastName(dto.getLastName());
        if (dto.getParentName() != null) existingStudent.setParentName(dto.getParentName());
        if (dto.getPhone() != null) existingStudent.setPhone(dto.getPhone());
        if (dto.getEmergencyContact() != null) existingStudent.setEmergencyContact(dto.getEmergencyContact());
        if (dto.getDob() != null) existingStudent.setDob(LocalDate.parse(dto.getDob()));

        // HASH PASSWORD ON UPDATE
        if (dto.getPassword() != null && !dto.getPassword().isBlank() && !dto.getPassword().startsWith("$2a$")) {
            existingStudent.setPassword(encoder.encode(dto.getPassword()));
        }

        if (dto.getSportIds() != null && !dto.getSportIds().isEmpty()) {
            Set<SportEntity> sports = dto.getSportIds().stream()
                    .map(sportId -> sportRepo.findById(sportId)
                            .orElseThrow(() -> new RuntimeException("Sport not found: " + sportId)))
                    .collect(Collectors.toSet());

            validateNoTimeConflicts(sports);
            existingStudent.setSports(sports);
            int totalFees = sports.stream().mapToInt(SportEntity::getFees).sum();//.mapToInt(sport -> sport.getFees())
            existingStudent.setTotalFees(totalFees);
        }

        studentRepo.save(existingStudent);
    }

    public StudentEntity getStudentById(Long id) {
        return studentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found: " + id));
    }
}
