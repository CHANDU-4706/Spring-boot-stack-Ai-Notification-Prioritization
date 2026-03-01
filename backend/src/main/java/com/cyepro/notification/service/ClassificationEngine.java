package com.cyepro.notification.service;

import com.cyepro.notification.model.AuditLog;
import com.cyepro.notification.model.NotificationEvent;
import com.cyepro.notification.model.Rule;
import com.cyepro.notification.repository.AuditLogRepository;
import com.cyepro.notification.repository.NotificationEventRepository;
import com.cyepro.notification.repository.RuleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClassificationEngine {

    private final NotificationEventRepository eventRepository;
    private final RuleRepository ruleRepository;
    private final AuditLogRepository auditLogRepository;
    private final AIService aiService;

    private static final int FATIGUE_THRESHOLD = 5;
    private static final double SIMILARITY_THRESHOLD = 0.85;

    @Async
    public void processEvent(String eventId) {
        NotificationEvent event = eventRepository.findById(eventId).orElse(null);
        if (event == null)
            return;

        long startTime = System.currentTimeMillis();

        try {
            // Fetch recent events for this user (last 1 hour)
            LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
            List<NotificationEvent> recentEvents = eventRepository
                    .findByUserIdAndCreatedAtAfterOrderByCreatedAtDesc(event.getUserId(), oneHourAgo);

            // Remove self from the list
            recentEvents.removeIf(e -> e.getId().equals(event.getId()));

            // Stage 1: Near-Duplicate Detection
            for (NotificationEvent recent : recentEvents) {
                double similarity = calculateSimilarity(event.getMessage(), recent.getMessage());
                if (similarity > SIMILARITY_THRESHOLD) {
                    finalizeDecision(event, "NEVER",
                            String.format("Near-duplicate of event %s (similarity: %.1f%%)", recent.getId(),
                                    similarity * 100),
                            "NEAR_DEDUPLICATE", startTime, null, null, null, false);
                    return;
                }
            }

            // Stage 2: Alert Fatigue Check (max 5 per hour)
            if (recentEvents.size() >= FATIGUE_THRESHOLD) {
                finalizeDecision(event, "LATER",
                        "Alert fatigue threshold exceeded (5 alerts in 1hr)",
                        "ALERT_FATIGUE", startTime, null, null, null, false);
                return;
            }

            // Stage 3: Custom Rules Evaluation
            List<Rule> activeRules = ruleRepository.findByIsActiveTrue();
            for (Rule rule : activeRules) {
                if (evaluateCondition(rule.getCondition(), event)) {
                    finalizeDecision(event, rule.getAction(),
                            "Custom Rule: " + rule.getRuleName(),
                            "RULE_ENGINE", startTime, null, rule.getPriorityScore(), null, false);
                    return;
                }
            }

            // Stage 4: AI Classification with Fallback
            Map<String, Object> eventMap = new HashMap<>();
            eventMap.put("message", event.getMessage());
            eventMap.put("source", event.getSource());
            eventMap.put("event_type", event.getEventType());
            eventMap.put("priority_hint", event.getPriorityHint());

            Map<String, Object> aiResult = aiService.classifyEvent(eventMap);

            String decision = (String) aiResult.get("decision");
            String reason = (String) aiResult.get("reason");
            Double score = aiResult.get("score") != null ? ((Number) aiResult.get("score")).doubleValue() : 0.5;
            Double confidence = aiResult.get("confidence") != null ? ((Number) aiResult.get("confidence")).doubleValue()
                    : 0.5;
            String model = (String) aiResult.getOrDefault("model", "groq-llama-3");
            boolean isFallback = "FALLBACK_RULE".equals(model);

            String engine = isFallback ? "FALLBACK_ENGINE" : "AI_ENGINE";
            finalizeDecision(event, decision, reason, engine, startTime, model, score, confidence, isFallback);

        } catch (Exception e) {
            log.error("Pipeline failure for event {}: {}", eventId, e.getMessage());
            finalizeDecision(event, "LATER",
                    "Ultimate pipeline fallback: " + e.getMessage(),
                    "SYSTEM_FALLBACK", startTime, null, 0.5, 1.0, true);
        }
    }

    // LATER Queue Background Processor
    @Scheduled(fixedRate = 60000) // Every 60 seconds
    public void processLaterQueue() {
        List<NotificationEvent> laterEvents = eventRepository.findByStatus(NotificationEvent.EventStatus.LATER_QUEUE);
        if (laterEvents.isEmpty())
            return;

        log.info("[SCHEDULER] Processing {} events from LATER queue", laterEvents.size());
        for (NotificationEvent event : laterEvents) {
            if (event.getExpiresAt() != null && event.getExpiresAt().isBefore(LocalDateTime.now())) {
                event.setStatus(NotificationEvent.EventStatus.PROCESSED);
                event.setDeliveredAt(LocalDateTime.now());
                eventRepository.save(event);
                log.info("[SCHEDULER] Delivered deferred event {}", event.getId());
            }
        }
    }

    private double calculateSimilarity(String s1, String s2) {
        if (s1 == null || s2 == null)
            return 0.0;
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();

        // Sorensen-Dice coefficient using bigrams
        if (s1.length() < 2 || s2.length() < 2)
            return s1.equals(s2) ? 1.0 : 0.0;

        java.util.Set<String> bigrams1 = new java.util.HashSet<>();
        java.util.Set<String> bigrams2 = new java.util.HashSet<>();

        for (int i = 0; i < s1.length() - 1; i++)
            bigrams1.add(s1.substring(i, i + 2));
        for (int i = 0; i < s2.length() - 1; i++)
            bigrams2.add(s2.substring(i, i + 2));

        java.util.Set<String> intersection = new java.util.HashSet<>(bigrams1);
        intersection.retainAll(bigrams2);

        return (2.0 * intersection.size()) / (bigrams1.size() + bigrams2.size());
    }

    private boolean evaluateCondition(String condition, NotificationEvent event) {
        try {
            // Safe string matching for rule conditions
            if (condition.contains("source") && condition.contains("'")) {
                String value = condition.split("'")[1];
                if (event.getSource() != null && event.getSource().equalsIgnoreCase(value))
                    return true;
            }
            if (condition.contains("event_type") && condition.contains("'")) {
                String value = condition.split("'")[1];
                if (event.getEventType() != null && event.getEventType().equalsIgnoreCase(value))
                    return true;
            }
            if (condition.contains("priority_hint") && condition.contains("'")) {
                String value = condition.split("'")[1];
                if (event.getPriorityHint() != null && event.getPriorityHint().equalsIgnoreCase(value))
                    return true;
            }
        } catch (Exception e) {
            log.warn("Failed to evaluate rule condition: {}", condition);
        }
        return false;
    }

    private void finalizeDecision(NotificationEvent event, String decision, String reason, String engine,
            long startTime, String aiModel, Double score, Double confidence, boolean isFallback) {
        long processingTimeMs = System.currentTimeMillis() - startTime;

        event.setEngineUsed(engine);
        event.setScore(score != null ? score : 0.5);
        event.setConfidence(confidence != null ? confidence : 1.0);
        event.setDecisionReason(reason);

        if ("NOW".equals(decision)) {
            event.setStatus(NotificationEvent.EventStatus.PROCESSED);
            event.setDeliveredAt(LocalDateTime.now());
        } else if ("LATER".equals(decision)) {
            event.setStatus(NotificationEvent.EventStatus.LATER_QUEUE);
            event.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        } else if ("NEVER".equals(decision) || "DROPPED".equals(decision)) {
            event.setStatus(NotificationEvent.EventStatus.DROPPED);
        }

        eventRepository.save(event);

        // Create immutable audit log
        AuditLog logEntry = new AuditLog();
        logEntry.setEventId(event.getId());
        logEntry.setUserId(event.getUserId());
        logEntry.setDecision(decision);
        logEntry.setReason(reason);
        logEntry.setEngineUsed(engine);
        logEntry.setAiModel(aiModel);
        logEntry.setAiConfidence(confidence);
        logEntry.setIsFallback(isFallback);
        logEntry.setProcessingTimeMs(processingTimeMs);
        logEntry.setScore(score);
        logEntry.setConfidence(confidence != null ? confidence : 1.0);
        auditLogRepository.save(logEntry);

        log.info("Event {} classified as {} by {} in {}ms", event.getId(), decision, engine, processingTimeMs);
    }
}
