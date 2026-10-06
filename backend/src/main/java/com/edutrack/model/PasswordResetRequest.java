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
@Document(collection = "password_reset_requests")
public class PasswordResetRequest {
    @Id
    private String id;
    private String userEmail;
    private String userName;
    private String userRole;
    private String reason;
    private String status; // Pending, Fulfilled, Rejected
    private String newTemporaryPassword;
    private LocalDateTime requestedAt;
    private LocalDateTime fulfilledAt;
}
