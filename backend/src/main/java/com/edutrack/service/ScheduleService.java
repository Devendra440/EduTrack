package com.edutrack.service;

import com.edutrack.exception.ScheduleNotFoundException;
import com.edutrack.model.Schedule;
import com.edutrack.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;

    public ScheduleService(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    public Schedule createSchedule(Schedule schedule) {
        schedule.setCreatedAt(LocalDateTime.now());
        return scheduleRepository.save(schedule);
    }

    public List<Map<String, Object>> getAllSchedules() {
        return scheduleRepository.findAll().stream()
                .map(this::convertToMapWithStatus)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getScheduleById(String id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ScheduleNotFoundException("Schedule not found with ID: " + id));
        return convertToMapWithStatus(schedule);
    }

    public Schedule updateSchedule(String id, Schedule scheduleDetails) {
        Schedule existing = scheduleRepository.findById(id)
                .orElseThrow(() -> new ScheduleNotFoundException("Schedule not found with ID: " + id));

        existing.setExamName(scheduleDetails.getExamName());
        existing.setExamType(scheduleDetails.getExamType());
        existing.setBranch(scheduleDetails.getBranch());
        existing.setSemester(scheduleDetails.getSemester());
        existing.setSubjectId(scheduleDetails.getSubjectId());
        existing.setSubjectCode(scheduleDetails.getSubjectCode());
        existing.setSubjectName(scheduleDetails.getSubjectName());
        existing.setExamDate(scheduleDetails.getExamDate());
        existing.setStartTime(scheduleDetails.getStartTime());
        existing.setEndTime(scheduleDetails.getEndTime());
        existing.setMarksPostingStartDate(scheduleDetails.getMarksPostingStartDate());
        existing.setMarksPostingDeadline(scheduleDetails.getMarksPostingDeadline());

        return scheduleRepository.save(existing);
    }

    public void deleteSchedule(String id) {
        if (!scheduleRepository.existsById(id)) {
            throw new ScheduleNotFoundException("Schedule not found with ID: " + id);
        }
        scheduleRepository.deleteById(id);
    }

    public List<Map<String, Object>> searchSchedules(String branch, String semester, String examType) {
        return scheduleRepository.findAll().stream()
                .filter(s -> branch == null || branch.isEmpty() || s.getBranch().equals(branch))
                .filter(s -> semester == null || semester.isEmpty() || s.getSemester().equals(semester))
                .filter(s -> examType == null || examType.isEmpty() || s.getExamType().equals(examType))
                .map(this::convertToMapWithStatus)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getUpcomingSchedules() {
        LocalDate today = LocalDate.now();
        return scheduleRepository.findAll().stream()
                .filter(s -> s.getExamDate() != null && !LocalDate.parse(s.getExamDate()).isBefore(today))
                .sorted(Comparator.comparing(s -> LocalDate.parse(s.getExamDate())))
                .map(this::convertToMapWithStatus)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getMarksPendingSchedules() {
        return scheduleRepository.findAll().stream()
                .map(this::convertToMapWithStatus)
                .filter(map -> "Marks Pending".equals(map.get("status")))
                .collect(Collectors.toList());
    }

    private String getScheduleStatus(Schedule schedule) {
        if (schedule.getExamDate() == null) return "Unknown";
        LocalDate today = LocalDate.now();
        LocalDate examDate = LocalDate.parse(schedule.getExamDate());
        LocalDate marksStart = schedule.getMarksPostingStartDate() != null ? LocalDate.parse(schedule.getMarksPostingStartDate()) : examDate;
        LocalDate marksDeadline = schedule.getMarksPostingDeadline() != null ? LocalDate.parse(schedule.getMarksPostingDeadline()) : examDate.plusDays(7);

        if (today.isBefore(examDate)) return "Upcoming";
        if (today.isEqual(examDate)) return "Ongoing";
        // exam completed
        if (today.isBefore(marksStart)) return "Completed";
        if (!today.isAfter(marksDeadline)) return "Marks Pending";
        return "Deadline Passed";
    }

    private Map<String, Object> convertToMapWithStatus(Schedule schedule) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", schedule.getId());
        map.put("examName", schedule.getExamName());
        map.put("examType", schedule.getExamType());
        map.put("branch", schedule.getBranch());
        map.put("semester", schedule.getSemester());
        map.put("subjectId", schedule.getSubjectId());
        map.put("subjectCode", schedule.getSubjectCode());
        map.put("subjectName", schedule.getSubjectName());
        map.put("examDate", schedule.getExamDate());
        map.put("startTime", schedule.getStartTime());
        map.put("endTime", schedule.getEndTime());
        map.put("marksPostingStartDate", schedule.getMarksPostingStartDate());
        map.put("marksPostingDeadline", schedule.getMarksPostingDeadline());
        map.put("createdAt", schedule.getCreatedAt());
        map.put("status", getScheduleStatus(schedule));
        return map;
    }
}
