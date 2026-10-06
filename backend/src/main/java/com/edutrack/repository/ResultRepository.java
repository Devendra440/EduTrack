package com.edutrack.repository;

import com.edutrack.model.Result;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResultRepository extends MongoRepository<Result, String> {
    List<Result> findByStudentId(String studentId);
    Optional<Result> findByStudentIdAndSemesterAndAcademicYear(String studentId, String semester, String academicYear);
    List<Result> findByBranchAndSemester(String branch, String semester);
    List<Result> findByStatus(String status);
    long countByStatus(String status);
}
