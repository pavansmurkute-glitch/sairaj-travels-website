package com.sairajtravels.site.controller;

import com.sairajtravels.site.entity.AdminUser;
import com.sairajtravels.site.service.UserManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserManagementService userService;
    
    // Enhanced login with role information (doesn't replace existing login)
    @PostMapping("/login-enhanced")
    public ResponseEntity<Map<String, Object>> loginEnhanced(@RequestBody Map<String, String> credentials) {
        try {
            String loginId = credentials.get("username"); // Can be username or email
            String password = credentials.get("password");
            
            if (loginId == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Username and password are required"
                ));
            }
            
            AdminUser user = userService.authenticate(loginId, password);
            
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Invalid username or password"
                ));
            }
            
            // Return user info with role and permissions
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Login successful",
                "user", Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "fullName", user.getFullName(),
                    "role", Map.of(
                        "id", user.getRole().getId(),
                        "name", user.getRole().getRoleName(),
                        "displayName", user.getRole().getDisplayName(),
                        "permissions", user.getRole().getPermissionsMap()
                    ),
                    "mustChangePassword", user.getMustChangePassword(),
                    "lastLogin", user.getLastLogin()
                ),
                "token", "enhanced-" + user.getId() // Simple token for now
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    // Get current user info
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@RequestParam Long userId) {
        try {
            var userOpt = userService.getUserById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            AdminUser user = userOpt.get();
            return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "role", Map.of(
                    "id", user.getRole().getId(),
                    "name", user.getRole().getRoleName(),
                    "displayName", user.getRole().getDisplayName(),
                    "permissions", user.getRole().getPermissionsMap()
                ),
                "mustChangePassword", user.getMustChangePassword(),
                "lastLogin", user.getLastLogin()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage()
            ));
        }
    }
    
    // Request password reset
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Email is required"
                ));
            }
            
            String token = userService.createPasswordResetToken(email);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Password reset email sent successfully. Please check your inbox.",
                "tokenGenerated", true
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    // Validate reset token
    @GetMapping("/validate-reset-token")
    public ResponseEntity<Map<String, Object>> validateResetToken(@RequestParam String token) {
        try {
            boolean isValid = userService.validateResetToken(token);
            
            return ResponseEntity.ok(Map.of(
                "valid", isValid,
                "message", isValid ? "Token is valid" : "Token is expired or invalid"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "valid", false,
                "message", e.getMessage()
            ));
        }
    }
    
    // Reset password with token
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String newPassword = request.get("newPassword");
            
            if (token == null || newPassword == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Token and new password are required"
                ));
            }
            
            boolean success = userService.resetPasswordWithToken(token, newPassword);
            
            if (success) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Password reset successfully. You can now login with your new password."
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Invalid or expired reset token"
                ));
            }
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    // Update last login (called after successful login)
    @PostMapping("/update-login")
    public ResponseEntity<Map<String, Object>> updateLastLogin(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            if (userId != null) {
                userService.updateLastLogin(userId);
                return ResponseEntity.ok(Map.of("success", true));
            }
            return ResponseEntity.badRequest().body(Map.of("success", false));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("success", false)); // Don't fail login for this
        }
    }
}
