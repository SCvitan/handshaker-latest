package com.handshaker.company_service.repository;

import com.handshaker.company_service.model.Connection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ConnectionRepository
        extends JpaRepository<Connection, UUID> {

    boolean existsByCompanyIdAndWorkerId(
            UUID companyId,
            UUID workerId
    );
}
