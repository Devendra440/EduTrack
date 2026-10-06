package com.edutrack.controller;

import com.edutrack.model.PasswordResetRequest;
import com.edutrack.model.User;
import com.edutrack.repository.UserRepository;
import com.edutrack.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final UserService userService;

    public AuthController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }

        Optional<User> userOpt = userRepository.findByEmail(email.trim().toLowerCase());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(password)) {
                user.setLastLogin(LocalDateTime.now());
                userRepository.save(user);

                userService.logAction(
                    "USER_LOGIN",
                    user.getEmail(),
                    user.getRole(),
                    user.getEmail(),
                    user.getRole(),
                    "Successful login by " + user.getFullName() + " (" + user.getRole() + ")",
                    "SUCCESS"
                );

                Map<String, Object> resp = new HashMap<>();
                resp.put("success", true);
                resp.put("token", "edutrack_jwt_" + user.getId());
                resp.put("user", Map.of(
                    "id", user.getId(),
                    "email", user.getEmail(),
                    "fullName", user.getFullName(),
                    "role", user.getRole(),
                    "department", user.getDepartment() != null ? user.getDepartment() : "",
                    "studentId", user.getStudentId() != null ? user.getStudentId() : ""
                ));
                return ResponseEntity.ok(resp);
            }
        }

        // Standard default login fallbacks if DB user not initialized yet
        if ((email.equalsIgnoreCase("admin@gmail.com") && password.equals("admin123")) ||
            (email.equalsIgnoreCase("admin@edutrack.com") && password.equals("admin123"))) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "token", "admin_token",
                "user", Map.of(
                    "id", "admin_1",
                    "email", "admin@gmail.com",
                    "fullName", "System Administrator",
                    "role", "ADMIN"
                )
            ));
        }

        if (email.equalsIgnoreCase("manager@gmail.com") && password.equals("manager123")) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "token", "manager_token",
                "user", Map.of(
                    "id", "manager_1",
                    "email", "manager@gmail.com",
                    "fullName", "Credential Manager",
                    "role", "CREDENTIAL_MANAGER"
                )
            ));
        }

        userService.logAction(
            "LOGIN_FAILED",
            email,
            "UNKNOWN",
            email,
            "UNKNOWN",
            "Failed login attempt for " + email,
            "FAILED"
        );

        return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String reason = payload.get("reason");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Valid email address is required"));
        }

        PasswordResetRequest request = userService.requestPasswordReset(email.trim().toLowerCase(), reason);
        return ResponseEntity.ok(Map.of(
            "message", "Password reset request submitted successfully. The Credential Manager will review your request.",
            "request", request
        ));
    }
}
