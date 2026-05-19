package com.handshaker.company_service.repository;

import com.handshaker.company_service.model.JobOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JobOfferRepository extends JpaRepository<JobOffer, UUID> {
    List<JobOffer> findByCompanyIdOrderBySentAtDesc(UUID companyId);

    List<JobOffer> findByWorkerId(UUID workerId);

    List<JobOffer> findByCompanyId(UUID companyId);

    @Modifying
    @Query("""
UPDATE JobOffer o
SET o.status = 'INTERESTED',
    o.respondedAt = CURRENT_TIMESTAMP
WHERE o.id = :offerId
AND o.workerId = :workerId
AND (o.status = 'SENT' OR o.status = 'VIEWED')
""")
    int markInterested(UUID offerId, UUID workerId);

    @Modifying
    @Query("""
UPDATE JobOffer o
SET o.status = 'REJECTED',
    o.respondedAt = CURRENT_TIMESTAMP
WHERE o.id = :offerId
AND o.workerId = :workerId
AND (o.status = 'SENT' OR o.status = 'VIEWED')
""")
    int markRejected(UUID offerId, UUID workerId);
}
