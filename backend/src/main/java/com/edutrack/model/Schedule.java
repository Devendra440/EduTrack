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
@Document(collection = "schedules")
public class Schedule {
    @Id
    private String id;
    
    private String examName;
    private String examType;
    private String branch;
    private String semester;
    private String subjectId;
    private String subjectCode;
    private String subjectName;
    private String examDate;
    private String startTime;
    private String endTime;
    private String marksPostingStartDate;
    private String marksPostingDeadline;
    private LocalDateTime createdAt;
}
