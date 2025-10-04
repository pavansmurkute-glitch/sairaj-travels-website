package com.sairajtravels.site;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class SairajTravelsSiteApplication {
    public static void main(String[] args) {
        System.out.println("🚀 Starting Sairaj Travels Backend Application...");
        System.out.println("🔍 Java Version: " + System.getProperty("java.version"));
        System.out.println("🔍 Spring Profiles: " + System.getProperty("spring.profiles.active", "default"));
        
        try {
            SpringApplication.run(SairajTravelsSiteApplication.class, args);
            System.out.println("✅ Application started successfully!");
        } catch (Exception e) {
            System.err.println("❌ Application failed to start!");
            System.err.println("❌ Error: " + e.getMessage());
            System.err.println("❌ Error Class: " + e.getClass().getName());
            e.printStackTrace();
            throw e;
        }
    }
    
    @GetMapping("/debug/startup")
    public String debugStartup() {
        System.out.println("🔍 Debug endpoint called - Application is running!");
        return "Application started successfully at: " + java.time.LocalDateTime.now();
    }
}
