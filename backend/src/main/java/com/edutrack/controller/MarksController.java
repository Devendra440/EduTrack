package com.edutrack.controller;

import com.edutrack.model.Marks;
import com.edutrack.service.MarksService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
@CrossOrigin(origins = "*")
public class MarksController {

    private final MarksService marksService;

    public MarksController(MarksService marksService) {
        this.marksService = marksService;
    }

    @PostMapping
    public ResponseEntity<Marks> saveMarks(@RequestBody Marks marks) {
        return new ResponseEntity<>(marksService.saveMarks(marks), HttpStatus.CREATED);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Marks>> getMarksByStudent(@PathVariable String studentId) {
        return ResponseEntity.ok(marksService.getMarksByStudent(studentId));
    }

    @GetMapping("/schedule/{scheduleId}")
    public ResponseEntity<List<Marks>> getMarksBySchedule(@PathVariable String scheduleId) {
        return ResponseEntity.ok(marksService.getMarksBySchedule(scheduleId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Marks> updateMarks(@PathVariable String id, @RequestBody Marks marks) {
        return ResponseEntity.ok(marksService.updateMarks(id, marks));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMarks(@PathVariable String id) {
        marksService.deleteMarks(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<Marks> submitMarks(@PathVariable String id) {
        return ResponseEntity.ok(marksService.submitMarks(id));
    }
}
