package com.sairajtravels.site.service;

import com.sairajtravels.site.entity.ContactInfo;
import com.sairajtravels.site.repository.ContactInfoRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ContactInfoService {

    private final ContactInfoRepository repository;

    public ContactInfoService(ContactInfoRepository repository) {
        this.repository = repository;
    }

    // Fetch single record (we assume only 1 record exists in the table)
    public Optional<ContactInfo> getContactInfo() {
        System.out.println("🔍 ContactInfoService: getContactInfo() called");
        try {
            System.out.println("🔍 ContactInfoService: Repository instance: " + (repository != null ? "OK" : "NULL"));
            System.out.println("🔍 ContactInfoService: Attempting to find contact info with ID 1...");
            Optional<ContactInfo> result = repository.findById(1L);
            System.out.println("🔍 ContactInfoService: Repository call completed. Result present: " + result.isPresent());
            return result;
        } catch (Exception e) {
            System.err.println("❌ ContactInfoService Error: " + e.getMessage());
            System.err.println("❌ ContactInfoService Error Class: " + e.getClass().getName());
            System.err.println("❌ ContactInfoService Error Stack Trace:");
            e.printStackTrace();
            throw e; // Re-throw to be caught by controller
        }
    }

    // Debug method to check record count
    public long getContactInfoCount() {
        System.out.println("🔍 ContactInfoService: getContactInfoCount() called");
        try {
            System.out.println("🔍 ContactInfoService: Attempting to count records...");
            long count = repository.count();
            System.out.println("🔍 ContactInfoService: Count result: " + count);
            return count;
        } catch (Exception e) {
            System.err.println("❌ ContactInfoService Count Error: " + e.getMessage());
            System.err.println("❌ ContactInfoService Count Error Class: " + e.getClass().getName());
            System.err.println("❌ ContactInfoService Count Error Stack Trace:");
            e.printStackTrace();
            throw e; // Re-throw to be caught by controller
        }
    }

    // Create contact info
    public ContactInfo createContactInfo(ContactInfo info) {
        return repository.save(info);
    }

    // Update contact info (optional, for future admin panel)
    public ContactInfo updateContactInfo(ContactInfo info) {
        return repository.save(info);
    }
}
