package com.handshaker.company_service.repository;

import com.handshaker.company_service.model.JobAd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JobAdRepository extends JpaRepository<JobAd, String> {

    List<JobAd> findByCompanyId(UUID userId);
}
