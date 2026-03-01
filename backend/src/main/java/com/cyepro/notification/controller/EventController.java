package com.cyepro.notification.controller;

import com.cyepro.notification.model.NotificationEvent;
import com.cyepro.notification.repository.NotificationEventRepository;
import com.cyepro.notification.service.ClassificationEngine;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EventController {

    private final NotificationEventRepository eventRepository;
    private final ClassificationEngine classificationEngine;

    @PostMapping
    public ResponseEntity<?> submitEvent(@RequestBody Map<String, String> payload) {
        String userId = payload.get("user_id");
        String eventType = payload.get("event_type");
        String message = payload.get("message");
        String source = payload.get("source");
        String priorityHint = payload.getOrDefault("priority_hint", "");

        if (userId == null || eventType == null || message == null || source == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
        }

        // Exact Deduplication
        Optional<NotificationEvent> existing = eventRepository.findByUserIdAndEventTypeAndMessageAndSource(
                userId, eventType, message, source);

        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("status", "DUPLICATE", "message", "Exact duplicate event detected"));
        }

        // Initialize and Save
        NotificationEvent event = new NotificationEvent();
        event.setId(UUID.randomUUID().toString());
        event.setUserId(userId);
        event.setEventType(eventType);
        event.setMessage(message);
        event.setSource(source);
        event.setPriorityHint(priorityHint);
        event.setStatus(NotificationEvent.EventStatus.PENDING);

        NotificationEvent savedEvent = eventRepository.save(event);

        // Trigger Async classification
        classificationEngine.processEvent(savedEvent.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("status", "ACCEPTED");
        response.put("message", "Event accepted for processing");
        response.put("event_id", savedEvent.getId());

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }
}
