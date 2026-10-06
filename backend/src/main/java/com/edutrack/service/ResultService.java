package com.edutrack.service;

import com.edutrack.model.Marks;
import com.edutrack.model.Result;
import com.edutrack.model.Student;
import com.edutrack.model.Subject;
import com.edutrack.repository.MarksRepository;
import com.edutrack.repository.ResultRepository;
import com.edutrack.repository.StudentRepository;
import com.edutrack.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ResultService {

    private final ResultRepository resultRepository;
    private final StudentRepository studentRepository;
    private final MarksRepository marksRepository;
    private final SubjectRepository subjectRepository;

    public ResultService(ResultRepository resultRepository, StudentRepository studentRepository, 
                         MarksRepository marksRepository, SubjectRepository subjectRepository) {
        this.resultRepository = resultRepository;
        this.studentRepository = studentRepository;
        this.marksRepository = marksRepository;
        this.subjectRepository = subjectRepository;
    }

    public Result calculateAndSaveResult(String studentId, String semester, String academicYear) {
        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Marks> submittedMarks = marksRepository.findByStudentIdAndSemester(studentId, semester).stream()
                .filter(Marks::isSubmitted)
                .collect(Collectors.toList());

        if (submittedMarks.isEmpty()) {
            throw new RuntimeException("No submitted marks found for the given student and semester");
        }

        List<Result.SubjectResult> subjectResults = new ArrayList<>();
        double totalMarks = 0;
        double totalMaxMarks = 0;
        boolean hasFailed = false;

        for (Marks marks : submittedMarks) {
            Subject subject = subjectRepository.findById(marks.getSubjectId())
                    .orElseThrow(() -> new RuntimeException("Subject not found"));

            double percentage = (marks.getMarks() / marks.getMaxMarks()) * 100;
            String grade = calculateGrade(percentage);
            boolean passed = !grade.equals("F");
            if (!passed) hasFailed = true;

            Result.SubjectResult sr = Result.SubjectResult.builder()
                    .subjectCode(subject.getSubjectCode())
                    .subjectName(subject.getSubjectName())
                    .marks(marks.getMarks())
                    .maxMarks(marks.getMaxMarks())
                    .grade(grade)
                    .credits(subject.getCredits())
                    .passed(passed)
                    .build();

            subjectResults.add(sr);
            totalMarks += marks.getMarks();
            totalMaxMarks += marks.getMaxMarks();
        }

        double finalPercentage = (totalMarks / totalMaxMarks) * 100;
        String finalGrade = hasFailed ? "F" : calculateGrade(finalPercentage);
        String status = hasFailed ? "FAIL" : "PASS";

        Result result = resultRepository.findByStudentIdAndSemesterAndAcademicYear(studentId, semester, academicYear)
                .orElse(new Result());

        result.setStudentId(student.getStudentId());
        result.setStudentName(student.getFullName());
        result.setBranch(student.getBranch());
        result.setSemester(semester);
        result.setAcademicYear(academicYear);
        result.setSubjectResults(subjectResults);
        result.setTotalMarks(totalMarks);
        result.setTotalMaxMarks(totalMaxMarks);
        result.setPercentage(finalPercentage);
        result.setGrade(finalGrade);
        result.setStatus(status);
        result.setPublishedAt(LocalDateTime.now());

        return resultRepository.save(result);
    }

    public List<Result> getResultsByStudent(String studentId) {
        return resultRepository.findByStudentId(studentId);
    }

    public Result getResultBySemester(String studentId, String semester) {
        return resultRepository.findByStudentId(studentId).stream()
                .filter(r -> r.getSemester().equals(semester))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Result not found for semester: " + semester));
    }

    public List<Result> getAllResults() {
        return resultRepository.findAll();
    }

    public List<Result> getTopPerformers(int limit) {
        return resultRepository.findAll().stream()
                .sorted((r1, r2) -> Double.compare(r2.getPercentage(), r1.getPercentage()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    private String calculateGrade(double percentage) {
        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B";
        if (percentage >= 60) return "C";
        if (percentage >= 50) return "D";
        return "F";
    }
}
