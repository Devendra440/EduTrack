package com.edutrack.service;

import com.edutrack.model.AuditLog;
import com.edutrack.model.PasswordResetRequest;
import com.edutrack.model.User;
import com.edutrack.repository.AuditLogRepository;
import com.edutrack.repository.PasswordResetRequestRepository;
import com.edutrack.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordResetRequestRepository resetRequestRepository;
    private final AuditLogRepository auditLogRepository;

    public UserService(UserRepository userRepository,
                       PasswordResetRequestRepository resetRequestRepository,
                       AuditLogRepository auditLogRepository) {
        this.userRepository = userRepository;
        this.resetRequestRepository = resetRequestRepository;
        this.auditLogRepository = auditLogRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User createUser(User user, String operatorEmail, String operatorRole) {
        if (user.getCreatedAt() == null) {
            user.setCreatedAt(LocalDateTime.now());
        }
        if (user.getStatus() == null) {
            user.setStatus("Active");
        }
        User saved = userRepository.save(user);

        logAction(
            "CREATE_" + user.getRole(),
            operatorEmail != null ? operatorEmail : "SYSTEM",
            operatorRole != null ? operatorRole : "CREDENTIAL_MANAGER",
            user.getEmail(),
            user.getRole(),
            "Created " + user.getRole() + " credentials for " + user.getFullName() + " (" + user.getEmail() + ")",
            "SUCCESS"
        );

        return saved;
    }

    public User updateUser(String id, User updatedUser, String operatorEmail, String operatorRole) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        existing.setFullName(updatedUser.getFullName());
        existing.setEmail(updatedUser.getEmail());
        existing.setPhone(updatedUser.getPhone());
        existing.setDepartment(updatedUser.getDepartment());
        existing.setBranch(updatedUser.getBranch());
        existing.setSemester(updatedUser.getSemester());
        existing.setStudentId(updatedUser.getStudentId());
        if (updatedUser.getStatus() != null) {
            existing.setStatus(updatedUser.getStatus());
        }

        User saved = userRepository.save(existing);

        logAction(
            "UPDATE_CREDENTIAL",
            operatorEmail != null ? operatorEmail : "CREDENTIAL_MANAGER",
            operatorRole != null ? operatorRole : "CREDENTIAL_MANAGER",
            existing.getEmail(),
            existing.getRole(),
            "Updated credentials for " + existing.getFullName(),
            "SUCCESS"
        );

        return saved;
    }

    public void deleteUser(String id, String operatorEmail, String operatorRole) {
        User existing = userRepository.findById(id).orElse(null);
        if (existing != null) {
            userRepository.deleteById(id);
            logAction(
                "DELETE_CREDENTIAL",
                operatorEmail != null ? operatorEmail : "CREDENTIAL_MANAGER",
                operatorRole != null ? operatorRole : "CREDENTIAL_MANAGER",
                existing.getEmail(),
                existing.getRole(),
                "Deleted credentials for " + existing.getFullName() + " (" + existing.getEmail() + ")",
                "SUCCESS"
            );
        }
    }

    public User changePassword(String id, String newPassword, String operatorEmail, String operatorRole) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(newPassword);
        user.setStatus("Active");
        User saved = userRepository.save(user);

        logAction(
            "CHANGE_PASSWORD",
            operatorEmail != null ? operatorEmail : "CREDENTIAL_MANAGER",
            operatorRole != null ? operatorRole : "CREDENTIAL_MANAGER",
            user.getEmail(),
            user.getRole(),
            "Changed/Reset password for user " + user.getEmail(),
            "SUCCESS"
        );

        return saved;
    }

    public PasswordResetRequest requestPasswordReset(String email, String reason) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        String name = userOpt.map(User::getFullName).orElse("Unknown User");
        String role = userOpt.map(User::getRole).orElse("USER");

        PasswordResetRequest request = PasswordResetRequest.builder()
                .userEmail(email)
                .userName(name)
                .userRole(role)
                .reason(reason != null ? reason : "Forgot password request")
                .status("Pending")
                .requestedAt(LocalDateTime.now())
                .build();

        PasswordResetRequest saved = resetRequestRepository.save(request);

        logAction(
            "FORGOT_PASSWORD_REQUEST",
            email,
            role,
            email,
            role,
            "Submitted forgot password request for " + email,
            "PENDING"
        );

        return saved;
    }

    public PasswordResetRequest fulfillResetRequest(String requestId, String newPassword, String operatorEmail, String operatorRole) {
        PasswordResetRequest req = resetRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Reset request not found"));

        req.setStatus("Fulfilled");
        req.setNewTemporaryPassword(newPassword);
        req.setFulfilledAt(LocalDateTime.now());
        resetRequestRepository.save(req);

        // Update actual user password
        Optional<User> userOpt = userRepository.findByEmail(req.getUserEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(newPassword);
            user.setStatus("Active");
            userRepository.save(user);
        }

        logAction(
            "FULFILL_PASSWORD_RESET",
            operatorEmail != null ? operatorEmail : "CREDENTIAL_MANAGER",
            operatorRole != null ? operatorRole : "CREDENTIAL_MANAGER",
            req.getUserEmail(),
            req.getUserRole(),
            "Fulfilled password reset request for " + req.getUserEmail(),
            "SUCCESS"
        );

        return req;
    }

    public List<PasswordResetRequest> getPendingResetRequests() {
        return resetRequestRepository.findAllByOrderByRequestedAtDesc();
    }

    public List<AuditLog> getAuditLogs() {
        return auditLogRepository.findTop50ByOrderByTimestampDesc();
    }

    public Map<String, Object> getMonitoringStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTeachers", userRepository.findByRole("TEACHER").size());
        stats.put("totalStudents", userRepository.findByRole("STUDENT").size());
        stats.put("totalManagers", userRepository.findByRole("CREDENTIAL_MANAGER").size());
        stats.put("totalAdmins", userRepository.findByRole("ADMIN").size());
        stats.put("pendingResets", resetRequestRepository.findByStatusOrderByRequestedAtDesc("Pending").size());
        stats.put("totalLogs", auditLogRepository.count());
        return stats;
    }

    public void logAction(String action, String performedBy, String performedByRole, String targetUser, String targetRole, String details, String status) {
        AuditLog log = AuditLog.builder()
                .action(action)
                .performedBy(performedBy)
                .performedByRole(performedByRole)
                .targetUser(targetUser)
                .targetRole(targetRole)
                .details(details)
                .status(status)
                .timestamp(LocalDateTime.now())
                .build();
        auditLogRepository.save(log);
    }
}
