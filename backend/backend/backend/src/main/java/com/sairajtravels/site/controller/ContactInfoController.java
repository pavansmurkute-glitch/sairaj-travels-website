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
            return ResponseEntity.status(404).build();
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
