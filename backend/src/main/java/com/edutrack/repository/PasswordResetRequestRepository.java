package com.edutrack.repository;

import com.edutrack.model.PasswordResetRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PasswordResetRequestRepository extends MongoRepository<PasswordResetRequest, String> {
    List<PasswordResetRequest> findByStatusOrderByRequestedAtDesc(String status);
    List<PasswordResetRequest> findAllByOrderByRequestedAtDesc();
}
