package com.edutrack.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String email;
    private String password;
    private String fullName;
    private String role; // ADMIN, CREDENTIAL_MANAGER, TEACHER, STUDENT
    private String studentId; // If student
    private String department; // If teacher/staff
    private String branch; // If student
    private String semester; // If student
    private String phone;
    private String status; // Active, Inactive, Reset_Required
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
}
