// Email Configuration for Sairaj Travels
// To set up EmailJS:
// 1. Go to https://www.emailjs.com/
// 2. Create a free account
// 3. Add an email service (Gmail, Outlook, etc.)
// 4. Create an email template
// 5. Replace the values below with your actual EmailJS credentials

export const emailConfig = {
  // EmailJS Public Key (from EmailJS dashboard)
  publicKey: 'YOUR_PUBLIC_KEY_HERE',
  
  // EmailJS Service ID (from EmailJS dashboard)
  serviceId: 'YOUR_SERVICE_ID_HERE',
  
  // EmailJS Template ID (from EmailJS dashboard)
  templateId: 'YOUR_TEMPLATE_ID_HERE',
  
  // Sairaj Travels email address
  sairajEmail: 'info@sairaj-travels.com',
  
  // Backup email (if primary fails)
  backupEmail: 'sairaj.travels@gmail.com'
};

// Email template variables that will be sent to EmailJS
// Make sure your EmailJS template includes these variables:
// {{from_name}} - Customer name
// {{from_email}} - Customer email
// {{customer_phone}} - Customer phone
// {{subject}} - Email subject
// {{message}} - Full trip details
// {{route_from}} - Starting location
// {{route_to}} - Destination
// {{total_cost}} - Total trip cost
// {{to_email}} - Sairaj email (recipient)
