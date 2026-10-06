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
@Document(collection = "audit_logs")
public class AuditLog {
    @Id
    private String id;
    private String action; // CREATE_TEACHER, CREATE_STUDENT, EDIT_CREDENTIAL, DELETE_USER, RESET_PASSWORD, FORGOT_PASSWORD_REQUEST, LOGIN
    private String performedBy;
    private String performedByRole;
    private String targetUser;
    private String targetRole;
    private String details;
    private String status; // SUCCESS, PENDING, FAILED
    private LocalDateTime timestamp;
}
