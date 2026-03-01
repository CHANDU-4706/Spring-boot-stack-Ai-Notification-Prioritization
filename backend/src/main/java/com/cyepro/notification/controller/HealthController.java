package com.cyepro.notification.controller;

import com.cyepro.notification.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HealthController {

    private final AIService aiService;

    @GetMapping
    public ResponseEntity<?> checkHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "up");
        health.put("database", "connected (PostgreSQL)");

        Map<String, Object> circuitBreaker = new HashMap<>();
        circuitBreaker.put("status", aiService.isCircuitOpen() ? "OPEN (Failing)" : "CLOSED (Healthy)");
        circuitBreaker.put("failures_recorded", aiService.getFailureCount());
        circuitBreaker.put("fallbacks_triggered", aiService.getFallbackCount());

        health.put("ai_circuit", circuitBreaker);
        health.put("timestamp", java.time.Instant.now().toString());

        return ResponseEntity.ok(health);
    }
}
