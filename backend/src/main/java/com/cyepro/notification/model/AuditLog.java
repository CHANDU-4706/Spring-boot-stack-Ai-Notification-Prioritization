package com.cyepro.notification.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs", indexes = {
        @Index(name = "idx_audit_created", columnList = "created_at")
})
@Data
@NoArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_id", nullable = false)
    private String eventId;

    @Column(name = "user_id")
    private String userId;

    @Column(nullable = false)
    private String decision;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(name = "engine_used", nullable = false)
    private String engineUsed;

    @Column(name = "ai_model")
    private String aiModel;

    @Column(name = "ai_confidence")
    private Double aiConfidence;

    @Column(name = "is_fallback")
    private Boolean isFallback = false;

    @Column(name = "processing_time_ms")
    private Long processingTimeMs;

    private Double score;
    private Double confidence;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
