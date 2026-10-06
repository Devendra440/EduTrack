package com.edutrack.service;

import com.edutrack.exception.InvalidMarksException;
import com.edutrack.exception.MarksNotFoundException;
import com.edutrack.model.Marks;
import com.edutrack.repository.MarksRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MarksService {

    private final MarksRepository marksRepository;

    public MarksService(MarksRepository marksRepository) {
        this.marksRepository = marksRepository;
    }

    public Marks saveMarks(Marks marks) {
        if (marks.getMarks() < 0 || marks.getMarks() > marks.getMaxMarks()) {
            throw new InvalidMarksException("Marks must be between 0 and " + marks.getMaxMarks());
        }
        if (marks.getCreatedAt() == null) {
            marks.setCreatedAt(LocalDateTime.now());
        }
        return marksRepository.save(marks);
    }

    public List<Marks> getMarksByStudent(String studentId) {
        return marksRepository.findByStudentId(studentId);
    }

    public List<Marks> getMarksBySchedule(String scheduleId) {
        return marksRepository.findByScheduleId(scheduleId);
    }

    public Marks updateMarks(String id, Marks marksDetails) {
        Marks existing = marksRepository.findById(id)
                .orElseThrow(() -> new MarksNotFoundException("Marks not found with ID: " + id));

        if (marksDetails.getMarks() < 0 || marksDetails.getMarks() > existing.getMaxMarks()) {
            throw new InvalidMarksException("Marks must be between 0 and " + existing.getMaxMarks());
        }

        existing.setMarks(marksDetails.getMarks());
        return marksRepository.save(existing);
    }

    public void deleteMarks(String id) {
        if (!marksRepository.existsById(id)) {
            throw new MarksNotFoundException("Marks not found with ID: " + id);
        }
        marksRepository.deleteById(id);
    }

    public Marks submitMarks(String id) {
        Marks existing = marksRepository.findById(id)
                .orElseThrow(() -> new MarksNotFoundException("Marks not found with ID: " + id));

        existing.setSubmitted(true);
        existing.setSubmittedAt(LocalDateTime.now());
        return marksRepository.save(existing);
    }
}
