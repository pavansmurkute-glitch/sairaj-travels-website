package com.sairajtravels.site.controller;

import com.sairajtravels.site.entity.ContactInfo;
import com.sairajtravels.site.service.ContactInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactInfoController {

    private final ContactInfoService service;

    public ContactInfoController(ContactInfoService service) {
        this.service = service;
    }

    // ✅ Fetch contact info
    @GetMapping
    public ResponseEntity<ContactInfo> getContactInfo() {
        try {
            ContactInfo contactInfo = service.getContactInfo()
                    .orElseThrow(() -> new RuntimeException("Contact Info not found"));
            return ResponseEntity.ok(contactInfo);
        } catch (Exception e) {
            System.err.println("❌ ContactInfoController Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(404).build();
        }
    }

    // ✅ Simple test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> testContactInfo() {
        return ResponseEntity.ok("Contact API is working!");
    }

    // ✅ Debug endpoint to check database connection
    @GetMapping("/debug")
    public ResponseEntity<String> debugContactInfo() {
        try {
            long count = service.getContactInfoCount();
            return ResponseEntity.ok("Contact info records count: " + count);
        } catch (Exception e) {
            System.err.println("❌ ContactInfoController Debug Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // ✅ Create contact info
    @PostMapping
    public ContactInfo createContactInfo(@RequestBody ContactInfo info) {
        return service.createContactInfo(info);
    }

    // ✅ Update contact info (optional, for admin panel)
    @PutMapping("/{id}")
    public ContactInfo updateContactInfo(@PathVariable Long id, @RequestBody ContactInfo info) {
        info.setId(id);
        return service.updateContactInfo(info);
    }
}
