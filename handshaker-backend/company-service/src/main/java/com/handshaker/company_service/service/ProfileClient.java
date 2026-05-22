package com.handshaker.company_service.service;

import com.handshaker.company_service.dto.ProfileSummaryDTO;
import com.handshaker.company_service.dto.WorkerSummaryResponse;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.UUID;

@Component
public class ProfileClient {

    private final RestTemplate restTemplate;

    public ProfileClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<ProfileSummaryDTO> getSummaries(List<UUID> ids) {

        String url = "http://profiles-service:8083/api/users/batch/summary";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 🔥 internal service identity
        headers.add("X-Internal-Service", "company-service");

        HttpEntity<List<UUID>> requestEntity =
                new HttpEntity<>(ids, headers);

        ResponseEntity<List<ProfileSummaryDTO>> response =
                restTemplate.exchange(
                        url,
                        HttpMethod.POST,
                        requestEntity,
                        new ParameterizedTypeReference<>() {}
                );

        return response.getBody();
    }

    public WorkerSummaryResponse getDashboardProfile(UUID workerId) {

        String url =
                "http://profiles-service:8083/api/users/batch/" +
                        workerId +
                        "/dashboard-summary";

        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Internal-Service", "company-service");

        HttpEntity<Void> requestEntity =
                new HttpEntity<>(headers);

        ResponseEntity<WorkerSummaryResponse> response =
                restTemplate.exchange(
                        url,
                        HttpMethod.GET,
                        requestEntity,
                        WorkerSummaryResponse.class
                );

        return response.getBody();
    }
}
