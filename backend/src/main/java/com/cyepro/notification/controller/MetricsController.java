package com.cyepro.notification.controller;

import com.cyepro.notification.model.NotificationEvent;
import com.cyepro.notification.repository.NotificationEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/metrics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MetricsController {
    private final NotificationEventRepository eventRepository;

    @GetMapping
    public ResponseEntity<?> getMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalProcessed", eventRepository.count());
        metrics.put("aiProcessed", eventRepository.countByEngineUsed("AI_ENGINE"));
        metrics.put("fallbackProcessed", eventRepository.countByEngineUsed("FALLBACK_ENGINE")
                + eventRepository.countByEngineUsed("SYSTEM_FALLBACK"));
        metrics.put("ruleProcessed", eventRepository.countByEngineUsed("RULE_ENGINE"));
        metrics.put("laterQueueSize", eventRepository.countByStatus(NotificationEvent.EventStatus.LATER_QUEUE));
        metrics.put("fatugueDropped", eventRepository.countByEngineUsed("ALERT_FATIGUE"));
        metrics.put("duplicatesDropped", eventRepository.countByEngineUsed("NEAR_DEDUPLICATE"));
        return ResponseEntity.ok(Map.of("metrics", metrics));
    }
}
