package com.cyepro.notification.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import org.springframework.core.ParameterizedTypeReference;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
@Slf4j
public class AIService {

    @Value("${groq.api.key:}")
    private String apiKey;

    @Value("${groq.model:llama-3.3-70b-versatile}")
    private String model;

    @Value("${groq.url:https://api.groq.com/openai/v1/chat/completions}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Circuit Breaker State
    private static final int FAILURE_THRESHOLD = 3;
    private final AtomicInteger failureCount = new AtomicInteger(0);
    private final AtomicInteger fallbackCount = new AtomicInteger(0);
    @Getter
    private final AtomicBoolean circuitOpen = new AtomicBoolean(false);

    public boolean isCircuitOpen() {
        return circuitOpen.get();
    }

    public int getFailureCount() {
        return failureCount.get();
    }

    public int getFallbackCount() {
        return fallbackCount.get();
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> classifyEvent(Map<String, Object> eventData) {
        // If circuit is open, go straight to fallback
        if (circuitOpen.get()) {
            log.warn("AI Circuit Breaker is OPEN. Using fallback.");
            fallbackCount.incrementAndGet();
            return getFallbackDecision(eventData);
        }

        // If no API key configured, use fallback
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("No Groq API key configured. Using fallback.");
            return getFallbackDecision(eventData);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        String prompt = String.format(
                "You are the CyePro Notification Prioritization Engine. " +
                        "Classify the following event into: 'NOW' (immediate action), 'LATER' (deferred), or 'DROPPED' (spam/unimportant). "
                        +
                        "Provide a priority score (0.0 to 1.0) and a concise reasoning. " +
                        "Event Data: %s. " +
                        "Respond ONLY in valid JSON format: {\"decision\": \"...\", \"score\": 0.0, \"reason\": \"...\", \"confidence\": 0.0}",
                eventData.toString());

        Map<String, Object> body = new HashMap<>();
        body.put("model", model);

        Map<String, String> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);

        body.put("messages", Collections.singletonList(message));
        body.put("response_format", Collections.singletonMap("type", "json_object"));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {
                    });
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    String content = (String) ((Map<String, Object>) choices.get(0).get("message")).get("content");
                    Map<String, Object> result = objectMapper.readValue(content, Map.class);
                    result.put("model", model);
                    // Reset circuit breaker on success
                    failureCount.set(0);
                    circuitOpen.set(false);
                    return result;
                }
            }
        } catch (Exception e) {
            log.error("AI Classification failed: {}", e.getMessage());
            int failures = failureCount.incrementAndGet();
            if (failures >= FAILURE_THRESHOLD) {
                circuitOpen.set(true);
                log.error("Circuit Breaker TRIPPED after {} failures!", failures);
            }
        }

        fallbackCount.incrementAndGet();
        return getFallbackDecision(eventData);
    }

    private Map<String, Object> getFallbackDecision(Map<String, Object> eventData) {
        Map<String, Object> fallback = new HashMap<>();
        String source = (String) eventData.getOrDefault("source", "");
        String priorityHint = (String) eventData.getOrDefault("priority_hint", "");

        if ("SECURITY".equalsIgnoreCase(source) || "critical".equalsIgnoreCase(priorityHint)) {
            fallback.put("decision", "NOW");
            fallback.put("reason", "Fallback: High priority source/hint detected during AI outage.");
        } else {
            fallback.put("decision", "LATER");
            fallback.put("reason", "Fallback: Default deferred delivery due to AI unavailability.");
        }
        fallback.put("score", 0.5);
        fallback.put("confidence", 1.0);
        fallback.put("model", "FALLBACK_RULE");
        return fallback;
    }
}
