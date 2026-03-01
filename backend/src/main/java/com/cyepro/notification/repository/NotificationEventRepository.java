package com.cyepro.notification.repository;

import com.cyepro.notification.model.NotificationEvent;
import com.cyepro.notification.model.NotificationEvent.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationEventRepository extends JpaRepository<NotificationEvent, String> {

    // Exact deduplication
    Optional<NotificationEvent> findByUserIdAndEventTypeAndMessageAndSource(
            String userId, String eventType, String message, String source);

    // Near-duplicate & fatigue: recent events for a user
    List<NotificationEvent> findByUserIdAndCreatedAtAfterOrderByCreatedAtDesc(
            String userId, LocalDateTime since);

    // LATER queue
    List<NotificationEvent> findByStatus(EventStatus status);

    // Metrics
    long countByEngineUsed(String engineUsed);

    long countByStatus(EventStatus status);
}
