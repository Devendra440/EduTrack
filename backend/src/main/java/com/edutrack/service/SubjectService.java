package com.edutrack.service;

import com.edutrack.exception.SubjectNotFoundException;
import com.edutrack.model.Subject;
import com.edutrack.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    public Subject createSubject(Subject subject) {
        if (subjectRepository.existsBySubjectCode(subject.getSubjectCode())) {
            throw new RuntimeException("Subject Code already exists: " + subject.getSubjectCode());
        }
        subject.setCreatedAt(LocalDateTime.now());
        return subjectRepository.save(subject);
    }

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public Subject getSubjectById(String id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new SubjectNotFoundException("Subject not found with ID: " + id));
    }

    public Subject updateSubject(String id, Subject subjectDetails) {
        Subject existing = getSubjectById(id);

        if (!existing.getSubjectCode().equals(subjectDetails.getSubjectCode()) &&
            subjectRepository.existsBySubjectCode(subjectDetails.getSubjectCode())) {
            throw new RuntimeException("Subject Code already exists: " + subjectDetails.getSubjectCode());
        }

        existing.setSubjectCode(subjectDetails.getSubjectCode());
        existing.setSubjectName(subjectDetails.getSubjectName());
        existing.setBranch(subjectDetails.getBranch());
        existing.setSemester(subjectDetails.getSemester());
        existing.setCredits(subjectDetails.getCredits());
        existing.setAcademicYear(subjectDetails.getAcademicYear());

        return subjectRepository.save(existing);
    }

    public void deleteSubject(String id) {
        if (!subjectRepository.existsById(id)) {
            throw new SubjectNotFoundException("Subject not found with ID: " + id);
        }
        subjectRepository.deleteById(id);
    }

    public List<Subject> searchSubjects(String name, String branch, String semester) {
        List<Subject> subjects = subjectRepository.findAll();
        return subjects.stream()
            .filter(s -> name == null || name.isEmpty() || s.getSubjectName().toLowerCase().contains(name.toLowerCase()))
            .filter(s -> branch == null || branch.isEmpty() || s.getBranch().equals(branch))
            .filter(s -> semester == null || semester.isEmpty() || s.getSemester().equals(semester))
            .collect(Collectors.toList());
    }
}
