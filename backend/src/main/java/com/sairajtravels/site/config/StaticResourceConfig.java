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
        
        // 1. Serve existing static images from classpath (for development)
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/")
                .setCachePeriod(3600);

        // 2. Serve File Manager uploads from filesystem (for production and new uploads)
        // This handles both existing Vehicle_details and new Gallary_images folders
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + Paths.get(uploadDir).toAbsolutePath().toString() + "/")
                .setCachePeriod(3600);

        // 3. Fallback for development - serve from target/classes
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + Paths.get("target/classes/static/images/").toAbsolutePath().toString() + "/")
                .setCachePeriod(3600);
    }
}
