package com.edutrack.controller;

import com.edutrack.model.AuditLog;
import com.edutrack.model.PasswordResetRequest;
import com.edutrack.model.User;
import com.edutrack.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getUsers(@RequestParam(required = false) String role) {
        if (role != null && !role.isBlank()) {
            return userService.getUsersByRole(role.toUpperCase());
        }
        return userService.getAllUsers();
    }

    @PostMapping("/teacher")
    public ResponseEntity<?> createTeacherCredential(
            @RequestBody User user,
            @RequestHeader(value = "X-Operator-Email", required = false) String operatorEmail,
            @RequestHeader(value = "X-Operator-Role", required = false) String operatorRole) {
        user.setRole("TEACHER");
        User created = userService.createUser(user, operatorEmail, operatorRole);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/student")
    public ResponseEntity<?> createStudentCredential(
            @RequestBody User user,
            @RequestHeader(value = "X-Operator-Email", required = false) String operatorEmail,
            @RequestHeader(value = "X-Operator-Role", required = false) String operatorRole) {
        user.setRole("STUDENT");
        User created = userService.createUser(user, operatorEmail, operatorRole);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable String id,
            @RequestBody User user,
            @RequestHeader(value = "X-Operator-Email", required = false) String operatorEmail,
            @RequestHeader(value = "X-Operator-Role", required = false) String operatorRole) {
        User updated = userService.updateUser(id, user, operatorEmail, operatorRole);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable String id,
            @RequestHeader(value = "X-Operator-Email", required = false) String operatorEmail,
            @RequestHeader(value = "X-Operator-Role", required = false) String operatorRole) {
        userService.deleteUser(id, operatorEmail, operatorRole);
        return ResponseEntity.ok(Map.of("message", "User credential deleted successfully"));
    }

    @PostMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(
            @PathVariable String id,
            @RequestBody Map<String, String> payload,
            @RequestHeader(value = "X-Operator-Email", required = false) String operatorEmail,
            @RequestHeader(value = "X-Operator-Role", required = false) String operatorRole) {
        String newPassword = payload.get("newPassword");
        if (newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "New password cannot be empty"));
        }
        User updated = userService.changePassword(id, newPassword, operatorEmail, operatorRole);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/monitoring/stats")
    public Map<String, Object> getStats() {
        return userService.getMonitoringStats();
    }

    @GetMapping("/monitoring/audit-logs")
    public List<AuditLog> getAuditLogs() {
        return userService.getAuditLogs();
    }

    @GetMapping("/reset-requests")
    public List<PasswordResetRequest> getResetRequests() {
        return userService.getPendingResetRequests();
    }

    @PostMapping("/reset-requests/{id}/fulfill")
    public ResponseEntity<?> fulfillResetRequest(
            @PathVariable String id,
            @RequestBody Map<String, String> payload,
            @RequestHeader(value = "X-Operator-Email", required = false) String operatorEmail,
            @RequestHeader(value = "X-Operator-Role", required = false) String operatorRole) {
        String newPassword = payload.get("newPassword");
        if (newPassword == null || newPassword.isBlank()) {
            newPassword = "Temp" + (int)(Math.random() * 90000 + 10000);
        }
        PasswordResetRequest fulfilled = userService.fulfillResetRequest(id, newPassword, operatorEmail, operatorRole);
        return ResponseEntity.ok(fulfilled);
    }
}
