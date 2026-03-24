package com.handshaker.auth_service.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class EmailService {

    @Value("${RESEND_API_KEY}")
    private String apiKey;

    public void sendVerificationEmail(String to, String token) {

        String verificationLink = "https://croworker.app/auth/verify?token=" + token;

        String body = """
        {
          "from": "onboarding@resend.dev",
          "to": ["%s"],
          "subject": "Verify your email",
          "html": "<p>Click below to verify:</p><a href='%s'>Verify Email</a>"
        }
        """.formatted(to, verificationLink);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(body, headers);

        new RestTemplate().postForEntity(
                "https://api.resend.com/emails",
                request,
                String.class
        );
    }
}
