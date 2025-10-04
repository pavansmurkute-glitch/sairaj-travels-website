package com.sairajtravels.site.service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SendGridEmailService {

    @Value("${sendgrid.api.key:}")
    private String sendGridApiKey;
    
    @Value("${sendgrid.from.email:PavansMurkute@gmail.com}")
    private String fromEmail;
    
    @Value("${sendgrid.from.name:Sairaj Travels}")
    private String fromName;

    public boolean sendHtmlEmail(String toEmail, String subject, String htmlContent, String fallbackText) {
        if (sendGridApiKey == null || sendGridApiKey.isEmpty()) {
            System.err.println("❌ SendGrid API key not configured. Email not sent to: " + toEmail);
            return false;
        }

        try {
            Email from = new Email(fromEmail, fromName);
            Email to = new Email(toEmail);
            Content content = new Content("text/html", htmlContent);
            
            Mail mail = new Mail(from, subject, to, content);
            
            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();
            
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            
            Response response = sg.api(request);
            
            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                System.out.println("✅ SendGrid email sent successfully to: " + toEmail);
                System.out.println("   Subject: " + subject);
                System.out.println("   Status Code: " + response.getStatusCode());
                return true;
            } else {
                System.err.println("❌ SendGrid email failed to: " + toEmail);
                System.err.println("   Status Code: " + response.getStatusCode());
                System.err.println("   Response Body: " + response.getBody());
                return false;
            }
            
        } catch (Exception e) {
            System.err.println("❌ SendGrid email exception for: " + toEmail);
            System.err.println("   Error: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public boolean sendTextEmail(String toEmail, String subject, String textContent) {
        if (sendGridApiKey == null || sendGridApiKey.isEmpty()) {
            System.err.println("❌ SendGrid API key not configured. Email not sent to: " + toEmail);
            return false;
        }

        try {
            Email from = new Email(fromEmail, fromName);
            Email to = new Email(toEmail);
            Content content = new Content("text/plain", textContent);
            
            Mail mail = new Mail(from, subject, to, content);
            
            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();
            
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            
            Response response = sg.api(request);
            
            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                System.out.println("✅ SendGrid text email sent successfully to: " + toEmail);
                System.out.println("   Subject: " + subject);
                System.out.println("   Status Code: " + response.getStatusCode());
                return true;
            } else {
                System.err.println("❌ SendGrid text email failed to: " + toEmail);
                System.err.println("   Status Code: " + response.getStatusCode());
                System.err.println("   Response Body: " + response.getBody());
                return false;
            }
            
        } catch (Exception e) {
            System.err.println("❌ SendGrid text email exception for: " + toEmail);
            System.err.println("   Error: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public boolean isConfigured() {
        return sendGridApiKey != null && !sendGridApiKey.isEmpty();
    }
}
