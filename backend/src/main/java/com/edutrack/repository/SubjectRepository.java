package com.edutrack.repository;

import com.edutrack.model.Subject;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends MongoRepository<Subject, String> {
    Optional<Subject> findBySubjectCode(String code);
    boolean existsBySubjectCode(String code);
    List<Subject> findByBranch(String branch);
    List<Subject> findBySemester(String semester);
    List<Subject> findByBranchAndSemester(String branch, String semester);
}
