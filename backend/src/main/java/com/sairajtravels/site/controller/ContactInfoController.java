package com.sairajtravels.site.controller;

import com.sairajtravels.site.entity.ContactInfo;
import com.sairajtravels.site.service.ContactInfoService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactInfoController {

    private final ContactInfoService service;

    public ContactInfoController(ContactInfoService service) {
        this.service = service;
    }

    // ✅ Fetch contact info
    @GetMapping
    public ContactInfo getContactInfo() {
        return service.getContactInfo()
                .orElseThrow(() -> new RuntimeException("Contact Info not found"));
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
