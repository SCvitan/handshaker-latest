package com.handshaker.company_service.messaging;

import com.handshaker.company_service.model.Company;
import com.handshaker.company_service.model.Connection;
import com.handshaker.company_service.repository.CompanyRepository;
import com.handshaker.company_service.repository.ConnectionRepository;
import com.handshaker.events.offer.OfferInterestedEvent;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class OfferEventListener {

    private final CompanyRepository companyRepository;
    private final ConnectionRepository connectionRepository;

    public OfferEventListener(
            CompanyRepository companyRepository,
            ConnectionRepository connectionRepository
    ) {
        this.companyRepository = companyRepository;
        this.connectionRepository = connectionRepository;
    }

    @RabbitListener(queues = "offer.interested.queue")
    public void onOfferInterested(OfferInterestedEvent event) {

        UUID companyId = event.companyId();
        UUID workerId = event.workerId();

        boolean exists = connectionRepository
                .existsByCompanyIdAndWorkerId(companyId, workerId);

        Company company = companyRepository.findById(companyId)
                .orElseThrow();

        if (company.getContactTokensRemaining() <= 0) {
            throw new RuntimeException("No tokens");
        }

        Connection connection = new Connection();
        connection.setCompanyId(companyId);
        connection.setWorkerId(workerId);

        connectionRepository.save(connection);
    }
}
