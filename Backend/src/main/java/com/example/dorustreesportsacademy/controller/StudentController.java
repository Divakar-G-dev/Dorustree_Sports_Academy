package com.example.dorustreesportsacademy.controller;

import com.example.dorustreesportsacademy.dto.SportDTO;
import com.example.dorustreesportsacademy.dto.StudentDTO;
import com.example.dorustreesportsacademy.entity.SportEntity;
import com.example.dorustreesportsacademy.entity.StudentEntity;
import com.example.dorustreesportsacademy.service.SportService;
import com.example.dorustreesportsacademy.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class StudentController {

    private final StudentService studentService;
    private final SportService sportService;

    public StudentController(StudentService studentService, SportService sportService) {
        this.studentService = studentService;
        this.sportService = sportService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerStudent(@RequestBody StudentDTO dto) {
        try {
            StudentEntity student = dto.toEntity();
            StudentEntity saved = studentService.registerStudent(student, dto.getSportIds());
            return ResponseEntity.ok(saved);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    public ResponseEntity<List<StudentEntity>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentEntity> getStudentById(@PathVariable Long id) {
        try {
            StudentEntity student = studentService.getStudentById(id);
            // ✅ FORCE LOAD SPORTS - Critical for frontend
            if (student.getSports() != null) {
                student.getSports().size(); // Trigger lazy loading
            }
            return ResponseEntity.ok(student);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(404).build();
        }
    }

    @GetMapping("/all-sports")
    public ResponseEntity<List<SportDTO>> getAllSports() {
        List<SportDTO> sports = sportService.getAllSports().stream()
                .map(sport -> {
                    SportDTO dto = new SportDTO();
                    dto.setId(sport.getId());
                    dto.setName(sport.getName());
                    dto.setFees(sport.getFees());
                    dto.setTiming(sport.getTiming());
                    return dto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(sports);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody Map<String, Object> dto) {
        try {
            StudentDTO studentDTO = new StudentDTO();

            if (dto.get("firstName") != null) studentDTO.setFirstName((String) dto.get("firstName"));
            if (dto.get("lastName") != null) studentDTO.setLastName((String) dto.get("lastName"));
            if (dto.get("phone") != null) studentDTO.setPhone((String) dto.get("phone"));
            if (dto.get("parentName") != null) studentDTO.setParentName((String) dto.get("parentName"));
            if (dto.get("dob") != null) studentDTO.setDob((String) dto.get("dob"));
            if (dto.get("emergencyContact") != null) studentDTO.setEmergencyContact((String) dto.get("emergencyContact"));
            if (dto.get("password") != null) studentDTO.setPassword((String) dto.get("password"));

            List<?> sportIdsList = (List<?>) dto.get("sportIds");
            if (sportIdsList != null) {
                Set<Long> sportIds = new HashSet<>();
                for (Object sportId : sportIdsList) {
                    sportIds.add(((Number) sportId).longValue());
                }
                studentDTO.setSportIds(sportIds);
            }

            studentService.updateStudent(id, studentDTO);
            return ResponseEntity.ok("✅ Updated successfully");
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteStudent(@PathVariable Long id) {
        try {
            studentService.deleteStudent(id);
            return ResponseEntity.ok("Deleted successfully");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(404).body(ex.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteAllStudent(){
        try{
            studentService.deleteAllStudent();
            return ResponseEntity.ok("Delete all the students");
        }catch (RuntimeException ex){
            return ResponseEntity.status(404).body(ex.getMessage());
        }
    }
}
