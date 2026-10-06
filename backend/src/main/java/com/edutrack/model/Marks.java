package com.edutrack.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "marks")
public class Marks {
    @Id
    private String id;
    
    private String studentId;
    private String subjectId;
    private String subjectCode;
    private String subjectName;
    private String scheduleId;
    private String branch;
    private String semester;
    private String academicYear;
    private double marks;
    private double maxMarks;
    private boolean submitted;
    private LocalDateTime submittedAt;
    private LocalDateTime createdAt;
}
