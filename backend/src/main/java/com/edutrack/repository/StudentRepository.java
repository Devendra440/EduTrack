package com.edutrack.repository;

import com.edutrack.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends MongoRepository<Student, String> {
    Optional<Student> findByStudentId(String studentId);
    boolean existsByStudentId(String studentId);
    List<Student> findByBranch(String branch);
    List<Student> findBySemester(String semester);
    List<Student> findByBranchAndSemester(String branch, String semester);
    List<Student> findByFullNameContainingIgnoreCase(String name);
    long countByBranch(String branch);
    long countByStatus(String status);
}
