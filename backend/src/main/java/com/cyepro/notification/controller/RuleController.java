package com.cyepro.notification.controller;

import com.cyepro.notification.model.Rule;
import com.cyepro.notification.repository.RuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/rules")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RuleController {
    private final RuleRepository ruleRepository;

    @GetMapping
    public ResponseEntity<?> getRules() {
        return ResponseEntity.ok(Map.of("data", ruleRepository.findAll()));
    }

    @PostMapping
    public ResponseEntity<?> createRule(@RequestBody Rule rule) {
        return ResponseEntity.ok(ruleRepository.save(rule));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<?> toggleRule(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        Rule rule = ruleRepository.findById(id).orElse(null);
        if (rule == null)
            return ResponseEntity.notFound().build();
        rule.setIsActive(body.getOrDefault("is_active", !rule.getIsActive()));
        return ResponseEntity.ok(ruleRepository.save(rule));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRule(@PathVariable Long id) {
        ruleRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Rule deleted"));
    }
}
