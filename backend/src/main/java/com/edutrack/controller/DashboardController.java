package com.edutrack.controller;

import com.edutrack.model.Result;
import com.edutrack.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    @GetMapping("/branch-distribution")
    public ResponseEntity<Map<String, Long>> getBranchDistribution() {
        return ResponseEntity.ok(dashboardService.getBranchDistribution());
    }

    @GetMapping("/result-performance")
    public ResponseEntity<Map<String, Long>> getResultPerformance() {
        return ResponseEntity.ok(dashboardService.getResultPerformance());
    }

    @GetMapping("/semester-performance")
    public ResponseEntity<Map<String, Double>> getSemesterPerformance() {
        return ResponseEntity.ok(dashboardService.getSemesterPerformance());
    }

    @GetMapping("/upcoming-exams")
    public ResponseEntity<List<Map<String, Object>>> getUpcomingExams() {
        return ResponseEntity.ok(dashboardService.getUpcomingExams());
    }

    @GetMapping("/marks-posting-status")
    public ResponseEntity<List<Map<String, Object>>> getMarksPostingStatus() {
        return ResponseEntity.ok(dashboardService.getMarksPostingStatus());
    }

    @GetMapping("/recent-activity")
    public ResponseEntity<List<String>> getRecentActivity() {
        return ResponseEntity.ok(dashboardService.getRecentActivity());
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<String>> getNotifications() {
        return ResponseEntity.ok(dashboardService.getNotifications());
    }

    @GetMapping("/top-performers")
    public ResponseEntity<List<Result>> getTopPerformers(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(dashboardService.getTopPerformers(limit));
    }

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }
}
