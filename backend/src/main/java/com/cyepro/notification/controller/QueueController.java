package com.cyepro.notification.controller;

import com.cyepro.notification.model.NotificationEvent;
import com.cyepro.notification.repository.NotificationEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/queue")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QueueController {

    private final NotificationEventRepository eventRepository;

    @GetMapping
    public ResponseEntity<?> getQueue() {
        return ResponseEntity.ok(Map.of("data",
                eventRepository.findByStatus(NotificationEvent.EventStatus.LATER_QUEUE)));
    }
}
