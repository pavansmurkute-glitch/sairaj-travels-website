package com.sairajtravels.site.controller;

import com.sairajtravels.site.entity.ContactInfo;
import com.sairajtravels.site.service.ContactInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

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
        System.out.println("🔍 ContactInfoController: getContactInfo() called");
        try {
            System.out.println("🔍 ContactInfoController: Attempting to get contact info from service...");
            Optional<ContactInfo> contactInfoOpt = service.getContactInfo();
            System.out.println("🔍 ContactInfoController: Service call completed. Result present: " + contactInfoOpt.isPresent());
            
            if (contactInfoOpt.isPresent()) {
                System.out.println("✅ ContactInfoController: Returning contact info from database");
                return ResponseEntity.ok(contactInfoOpt.get());
            } else {
                System.out.println("⚠️ ContactInfoController: No contact info in database, returning default");
                // Return default contact info if none exists in database
                ContactInfo defaultContact = new ContactInfo();
                defaultContact.setId(1L);
                defaultContact.setPhoneOffice("+91 98507 48273");
                defaultContact.setPhoneMobile("+91 98507 48273");
                defaultContact.setPhoneWhatsapp("+91 98507 48273");
                defaultContact.setEmailPrimary("info@sairajtravels.com");
                defaultContact.setEmailBookings("bookings@sairajtravels.com");
                defaultContact.setEmailSupport("support@sairajtravels.com");
                defaultContact.setAddressLine1("Sairaj Travels Office, Pune");
                defaultContact.setAddressCity("Pune");
                defaultContact.setAddressState("Maharashtra");
                defaultContact.setAddressPincode("411001");
                defaultContact.setBusinessHoursWeekdays("24/7 Available");
                defaultContact.setBusinessHoursSunday("24/7 Available");
                defaultContact.setSocialFacebook("https://facebook.com/sairajtravels");
                defaultContact.setSocialInstagram("https://instagram.com/sairajtravels");
                defaultContact.setSocialLinkedin("https://linkedin.com/company/sairajtravels");
                System.out.println("✅ ContactInfoController: Default contact info created and returning");
                return ResponseEntity.ok(defaultContact);
            }
        } catch (Exception e) {
            System.err.println("❌ ContactInfoController Error: " + e.getMessage());
            System.err.println("❌ ContactInfoController Error Class: " + e.getClass().getName());
            System.err.println("❌ ContactInfoController Error Stack Trace:");
            e.printStackTrace();
            
            // Return error details in response for debugging
            return ResponseEntity.status(500).body(null);
        }
    }

    // ✅ Simple test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> testContactInfo() {
        System.out.println("🔍 ContactInfoController: /test endpoint called");
        return ResponseEntity.ok("Contact API is working!");
    }

    // ✅ Basic health check without database
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        System.out.println("🔍 ContactInfoController: /ping endpoint called");
        return ResponseEntity.ok("PONG - Contact controller is alive!");
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
