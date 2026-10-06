package com.edutrack.repository;

import com.edutrack.model.Marks;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarksRepository extends MongoRepository<Marks, String> {
    List<Marks> findByStudentId(String studentId);
    List<Marks> findByStudentIdAndSemester(String studentId, String semester);
    List<Marks> findByScheduleId(String scheduleId);
    Optional<Marks> findByStudentIdAndScheduleId(String studentId, String scheduleId);
    List<Marks> findByBranchAndSemester(String branch, String semester);
    List<Marks> findBySubmitted(boolean submitted);
}
