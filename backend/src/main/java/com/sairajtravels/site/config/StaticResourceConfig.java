package com.sairajtravels.site.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

/**
 * Unified Static Resource Configuration
 * Handles all static file serving for both existing and File Manager uploads
 */
@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:src/main/resources/static/images}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        
        // Unified static resource handler for all images
        // This serves both existing files and File Manager uploads
        registry.addResourceHandler("/images/**")
                .addResourceLocations(
                    "classpath:/static/images/",  // For existing files
                    "file:" + Paths.get(uploadDir).toAbsolutePath().toString() + "/",  // For File Manager uploads
                    "file:" + Paths.get("target/classes/static/images/").toAbsolutePath().toString() + "/"  // Development fallback
                )
                .setCachePeriod(3600);
    }
}
