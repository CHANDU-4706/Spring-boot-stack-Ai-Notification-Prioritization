package com.cyepro.notification.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.HashMap;

@RestController
public class RootController {

    @GetMapping("/")
    public Map<String, String> index() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "up");
        response.put("message", "CyePro AI Notification Prioritization Engine (Spring Boot Edition)");
        response.put("api_base", "/api");
        response.put("health_check", "/api/health");
        return response;
    }
}
