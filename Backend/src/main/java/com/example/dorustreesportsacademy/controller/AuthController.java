package com.example.dorustreesportsacademy.controller;
import com.example.dorustreesportsacademy.entity.StudentEntity;
import com.example.dorustreesportsacademy.repository.StudentRepository;
import com.example.dorustreesportsacademy.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private StudentService studentService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    static class LoginRequest {
        public String email;
        public String password;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            StudentEntity user = studentRepo.findByEmail(request.email)
                    .orElseThrow(() -> new RuntimeException("Email not found"));

            // ✅ AUTO-HASH PLAIN TEXT ON FIRST LOGIN
            if (!user.getPassword().startsWith("$2a$")) {
                user.setPassword(encoder.encode(request.password));
                studentRepo.save(user);
            }

            if (!encoder.matches(request.password, user.getPassword())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Wrong password"));
            }

            // ✅ FETCH COMPLETE USER DATA including sports
            StudentEntity fullUser = studentService.getStudentById(user.getStudentId());

            String token = Base64.getEncoder().encodeToString(
                    (user.getStudentId() + "|" + user.getEmail() + "|" + user.getRole()).getBytes()
            );

            Map<String, Object> response = new java.util.HashMap<>();
            response.put("token", token);
            response.put("user", Map.of(
                    "id", user.getStudentId(),
                    "email", user.getEmail(),
                    "role", user.getRole(),
                    "firstName", user.getFirstName(),
                    "profile", Map.of(
                            "firstName", user.getFirstName(),
                            "lastName", user.getLastName(),
                            "phone", user.getPhone(),
                            "parentName", fullUser.getParentName() != null ? fullUser.getParentName() : "",
                            "dob", fullUser.getDob() != null ? fullUser.getDob().toString().split("T")[0] : "",
                            "emergencyContact", fullUser.getEmergencyContact() != null ? fullUser.getEmergencyContact() : ""
                    ),
                    "sports", fullUser.getSports() != null ? fullUser.getSports() : new ArrayList<>()
            ));

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }

    @PostMapping("/hash")
    public Map<String, String> hash(@RequestBody Map<String, String> req) {
        return Map.of("hashed", encoder.encode(req.get("password")));
    }

    @PostMapping("/auto-hash-all")
    public String autoHashAll() {
        List<StudentEntity> students = studentRepo.findAll();
        int hashedCount = 0;
        for (StudentEntity student : students) {
            if (student.getPassword() != null && !student.getPassword().startsWith("$2a$")) {
                student.setPassword(encoder.encode(student.getPassword()));
                studentRepo.save(student);
                hashedCount++;
            }
        }
        return "✅ " + hashedCount + " passwords auto-hashed!";
    }
}
