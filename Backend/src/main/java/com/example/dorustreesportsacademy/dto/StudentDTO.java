package com.example.dorustreesportsacademy.dto;

import com.example.dorustreesportsacademy.entity.StudentEntity;
import lombok.Data;
import java.util.Set;

@Data
public class StudentDTO {
    private String firstName;
    private String lastName;
    private String googleEmail;        // ✅ NEW: Admin enters Gmail for OAuth
    private String email;              // ✅ Backend maps googleEmail → email
    private String phone;
    private String parentName;
    private String emergencyContact;
    private String dob;
    private String password;
    private Set<Long> sportIds;

    // ✅ MODIFIED: Map googleEmail to email field (for OAuth compatibility)
    public StudentEntity toEntity() {
        StudentEntity s = new StudentEntity();
        s.setFirstName(firstName);
        s.setLastName(lastName);
        // KEY CHANGE: Use googleEmail for OAuth login matching
        s.setEmail(googleEmail != null ? googleEmail : email);
        s.setPhone(phone);
        s.setParentName(parentName);
        s.setEmergencyContact(emergencyContact);
        s.setDob(java.time.LocalDate.parse(dob));
        s.setPassword(password);  // Optional for OAuth users
        s.setRole("Student");     // Default role

        return s;
    }
}

