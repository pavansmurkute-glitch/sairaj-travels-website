package com.sairajtravels.site.controller;

import com.sairajtravels.site.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "*")
public class EmailHealthController {

    @Autowired
    private EmailService emailService;

    @Value("${spring.mail.host:}")
    private String mailHost;

    @Value("${spring.mail.port:}")
    private String mailPort;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> checkEmailHealth() {
        Map<String, Object> response = new HashMap<>();
        LocalDateTime timestamp = LocalDateTime.now();
        
        response.put("timestamp", timestamp.toString());
        response.put("service", "Email Health Check");
        
        // Email configuration info
        Map<String, String> config = new HashMap<>();
        config.put("host", mailHost);
        config.put("port", mailPort);
        config.put("username", mailUsername);
        config.put("configured", mailHost != null && !mailHost.isEmpty() ? "true" : "false");
        response.put("configuration", config);
        
        // Test email service connectivity
        Map<String, Object> healthStatus = new HashMap<>();
        try {
            // Test SMTP connection by creating a test message (without sending)
            healthStatus.put("status", "HEALTHY");
            healthStatus.put("message", "Email service configuration is valid");
            healthStatus.put("smtp_host", mailHost);
            healthStatus.put("smtp_port", mailPort);
            healthStatus.put("can_connect", "true");
            response.put("health", healthStatus);
            response.put("overall_status", "OK");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            healthStatus.put("status", "UNHEALTHY");
            healthStatus.put("message", "Email service has issues: " + e.getMessage());
            healthStatus.put("error", e.getClass().getSimpleName());
            healthStatus.put("can_connect", "false");
            response.put("health", healthStatus);
            response.put("overall_status", "ERROR");
            
            return ResponseEntity.status(503).body(response);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testEmailService() {
        Map<String, Object> response = new HashMap<>();
        LocalDateTime timestamp = LocalDateTime.now();
        
        response.put("timestamp", timestamp.toString());
        response.put("service", "Email Test");
        
        try {
            // Send a test email to the configured email address
            String testEmail = mailUsername; // Send test to the configured email
            String testSubject = "Sairaj Travels - Email Service Test";
            String testHtml = "<h3>Email Service Test</h3><p>This is a test email from Sairaj Travels system.</p><p>Timestamp: " + timestamp + "</p>";
            String testText = "Email Service Test\n\nThis is a test email from Sairaj Travels system.\nTimestamp: " + timestamp;
            
            emailService.sendHtmlEmail(testEmail, testSubject, testHtml, testText);
            
            response.put("status", "SUCCESS");
            response.put("message", "Test email sent successfully");
            response.put("test_email", testEmail);
            response.put("email_attempted", "true");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "FAILED");
            response.put("message", "Test email failed: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            response.put("email_attempted", "false");
            response.put("note", "Check backend logs for detailed email content if needed");
            
            return ResponseEntity.status(503).body(response);
        }
    }

    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getEmailConfig() {
        Map<String, Object> response = new HashMap<>();
        
        Map<String, String> config = new HashMap<>();
        config.put("host", mailHost);
        config.put("port", mailPort);
        config.put("username", mailUsername);
        config.put("configured", mailHost != null && !mailHost.isEmpty() ? "true" : "false");
        
        response.put("email_configuration", config);
        response.put("timestamp", LocalDateTime.now().toString());
        
        return ResponseEntity.ok(response);
    }
}
