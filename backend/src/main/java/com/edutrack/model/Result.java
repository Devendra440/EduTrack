package com.edutrack.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "results")
public class Result {
    @Id
    private String id;
    
    private String studentId;
    private String studentName;
    private String branch;
    private String semester;
    private String academicYear;
    private List<SubjectResult> subjectResults;
    private double totalMarks;
    private double totalMaxMarks;
    private double percentage;
    private String grade;
    private String status;
    private LocalDateTime publishedAt;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubjectResult {
        private String subjectCode;
        private String subjectName;
        private double marks;
        private double maxMarks;
        private String grade;
        private int credits;
        private boolean passed;
    }
}
