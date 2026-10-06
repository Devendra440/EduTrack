package com.edutrack.service;

import com.edutrack.model.Result;
import com.edutrack.repository.ResultRepository;
import com.edutrack.repository.StudentRepository;
import com.edutrack.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final ScheduleService scheduleService;
    private final ResultRepository resultRepository;
    private final ResultService resultService;

    public DashboardService(StudentRepository studentRepository, SubjectRepository subjectRepository,
                            ScheduleService scheduleService, ResultRepository resultRepository, ResultService resultService) {
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
        this.scheduleService = scheduleService;
        this.resultRepository = resultRepository;
        this.resultService = resultService;
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", studentRepository.count());
        stats.put("totalSubjects", subjectRepository.count());
        stats.put("upcomingExams", scheduleService.getUpcomingSchedules().size());
        stats.put("pendingMarks", scheduleService.getMarksPendingSchedules().size());

        long passed = resultRepository.countByStatus("PASS");
        long totalResults = resultRepository.count();
        double passRate = totalResults > 0 ? (double) passed / totalResults * 100 : 0.0;
        stats.put("passRate", passRate);
        
        stats.put("publishedResults", totalResults);
        stats.put("failedStudents", resultRepository.countByStatus("FAIL"));

        double avgPercentage = resultRepository.findAll().stream()
                .mapToDouble(Result::getPercentage)
                .average()
                .orElse(0.0);
        stats.put("averagePercentage", avgPercentage);

        return stats;
    }

    public Map<String, Long> getBranchDistribution() {
        return studentRepository.findAll().stream()
                .collect(Collectors.groupingBy(s -> s.getBranch(), Collectors.counting()));
    }

    public Map<String, Long> getResultPerformance() {
        Map<String, Long> perf = new HashMap<>();
        perf.put("Passed", resultRepository.countByStatus("PASS"));
        perf.put("Failed", resultRepository.countByStatus("FAIL"));
        return perf;
    }

    public Map<String, Double> getSemesterPerformance() {
        return resultRepository.findAll().stream()
                .collect(Collectors.groupingBy(Result::getSemester,
                        Collectors.averagingDouble(Result::getPercentage)));
    }

    public List<Map<String, Object>> getUpcomingExams() {
        return scheduleService.getUpcomingSchedules().stream()
                .limit(5)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getMarksPostingStatus() {
        return scheduleService.getMarksPendingSchedules();
    }

    public List<String> getRecentActivity() {
        return Arrays.asList(
            "Result published for 5th Semester CSE",
            "New exam schedule created for 3rd Semester IT",
            "Marks submitted for Java Programming",
            "New student admitted to ECE branch",
            "Exam completed for Database Management"
        );
    }

    public List<String> getNotifications() {
        return Arrays.asList(
            "Marks posting deadline approaching for Data Structures",
            "3 students missing in recent internal assessment",
            "Upcoming holiday on Friday"
        );
    }

    public List<Result> getTopPerformers(int limit) {
        return resultService.getTopPerformers(limit);
    }
}
