package com.edutrack.controller;

import com.edutrack.model.Result;
import com.edutrack.service.ResultService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "*")
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<Result> calculateResult(@RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(resultService.calculateAndSaveResult(
                payload.get("studentId"),
                payload.get("semester"),
                payload.get("academicYear")
        ));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Result>> getResultsByStudent(@PathVariable String studentId) {
        return ResponseEntity.ok(resultService.getResultsByStudent(studentId));
    }

    @GetMapping("/student/{studentId}/semester/{semester}")
    public ResponseEntity<Result> getResultBySemester(@PathVariable String studentId, @PathVariable String semester) {
        return ResponseEntity.ok(resultService.getResultBySemester(studentId, semester));
    }

    @GetMapping
    public ResponseEntity<List<Result>> getAllResults() {
        return ResponseEntity.ok(resultService.getAllResults());
    }

    @GetMapping("/top-performers")
    public ResponseEntity<List<Result>> getTopPerformers(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(resultService.getTopPerformers(limit));
    }
}
