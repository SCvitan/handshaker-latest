package com.handshaker.auth_service.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    @Value("${RESEND_API_KEY}")
    private String apiKey;

    @Value("${resend.from-email}")
    private String fromEmail;

    public void sendVerificationEmail(String to, String token) {

        String verificationLink = "https://croworker.app/api/auth/verify?token=" + token;

        // Build payload as a Map
        Map<String, Object> payload = new HashMap<>();
        payload.put("from", fromEmail);
        payload.put("to", Collections.singletonList(to));
        payload.put("subject", "Verify your email address");

        String html = """
                <div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                    <h2>Verify your email address</h2>
                
                    <p>Thanks for signing up! Please confirm your email address by clicking the button below:</p>
                
                    <p style='margin: 30px 0;'>
                        <a href='%s'
                           style='background-color: #4CAF50;
                                  color: white;
                                  padding: 12px 20px;
                                  text-decoration: none;
                                  border-radius: 5px;
                                  display: inline-block;'>
                           Verify Email
                        </a>
                    </p>
                
                    <p>If the button above doesn't work, copy and paste this link into your browser:</p>
                
                    <p>
                        <a href='%s'>%s</a>
                    </p>
                
                    <hr style='margin: 30px 0;'/>
                
                    <p style='font-size: 12px; color: #777;'>
                        If you didn’t create an account, you can safely ignore this email.
                    </p>
                </div>
                """.formatted(verificationLink, verificationLink, verificationLink);

        payload.put("html", html);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        new RestTemplate().postForEntity(
                "https://api.resend.com/emails",
                request,
                String.class
        );
    }
}