package com.handshaker.profiles_service.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.handshaker.profiles_service.dto.WorkerMatchingCriteria;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class AiMatchingService {

    private final WebClient webClient;

    public AiMatchingService(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("https://api.openai.com/v1")
                .defaultHeader("Authorization", "Bearer " + System.getenv("OPENAI_API_KEY"))
                .build();
    }

    public WorkerMatchingCriteria extractCriteria(String message) throws JsonProcessingException {

        String prompt = """
            Extract worker search criteria.

            Return ONLY valid JSON:

            {
              "position": "",
              "country": "",
              "minExperience": 0,
              "language": ""
            }

            Message:
            """ + message;

        String response = webClient.post()
                .uri("/chat/completions")
                .header("Content-Type", "application/json")
                .bodyValue(createRequest(prompt))
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return parse(response);
    }

    private Map<String, Object> createRequest(String prompt) {
        return Map.of(
                "model", "gpt-4o-mini",
                "messages", List.of(
                        Map.of("role", "system", "content", "You extract structured job search filters. Return only JSON."),
                        Map.of("role", "user", "content", prompt)
                ),
                "temperature", 0.2
        );
    }

    private WorkerMatchingCriteria parse(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();

            JsonNode root = mapper.readTree(response);

            String content = root
                    .path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();

            return mapper.readValue(content, WorkerMatchingCriteria.class);

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse OpenAI response", e);
        }
    }

}