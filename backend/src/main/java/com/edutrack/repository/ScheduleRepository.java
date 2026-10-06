package com.edutrack.repository;

import com.edutrack.model.Schedule;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepository extends MongoRepository<Schedule, String> {
    List<Schedule> findByBranch(String branch);
    List<Schedule> findBySemester(String semester);
    List<Schedule> findByBranchAndSemester(String branch, String semester);
    List<Schedule> findBySubjectId(String subjectId);
}
