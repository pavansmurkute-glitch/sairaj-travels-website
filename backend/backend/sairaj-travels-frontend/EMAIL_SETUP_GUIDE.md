# 📧 Email Setup Guide for Sairaj Travels

## 🎯 Current Status
The "Send to Sairaj Team" functionality is implemented with **3 fallback levels**:

1. **EmailJS** (Direct email sending) - *Requires setup*
2. **Mailto** (Opens email client) - *Works immediately*
3. **Clipboard Copy** (Copy details) - *Final fallback*

## 🚀 Quick Start (Works Now)
**No setup required!** The system currently uses **mailto** which:
- Opens the user's default email client (Gmail, Outlook, etc.)
- Pre-fills the email with all trip details
- User just needs to click "Send"

## ⚡ Enhanced Setup (Optional)
For **direct email sending** without opening email client:

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (1000 emails/month free)

### Step 2: Add Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions

### Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template content:

```
Subject: New Trip Inquiry - {{from_name}} ({{route_from}} to {{route_to}})

{{message}}

---
Customer Contact: {{customer_phone}}
Reply to: {{from_email}}
Total Cost: {{total_cost}}
```

### Step 4: Update Configuration
Edit `src/config/email.js`:

```javascript
export const emailConfig = {
  publicKey: 'your_actual_public_key',      // From EmailJS dashboard
  serviceId: 'your_actual_service_id',      // From EmailJS dashboard  
  templateId: 'your_actual_template_id',    // From EmailJS dashboard
  sairajEmail: 'info@sairaj-travels.com',  // Your actual email
  backupEmail: 'sairaj.travels@gmail.com'  // Backup email
};
```

### Step 5: Test
1. Fill customer details in trip planner
2. Plan a route
3. Click "Send to Sairaj Team"
4. Should show "Trip details sent successfully to Sairaj team via email!"

## 🛡️ Fallback System
If EmailJS fails, the system automatically:
1. **Tries mailto** (opens email client)
2. **Copies to clipboard** if email client fails
3. **Shows contact info** as final fallback

## 📱 Current Behavior
**Right now** (without EmailJS setup):
- User clicks "Send to Sairaj Team"
- Email client opens with pre-filled message
- User clicks "Send" in their email client
- You receive the email with all trip details

## ✅ What's Included in Email
- Customer details (name, phone, email)
- Complete route information
- Vehicle and passenger details
- Full cost breakdown with all expenses
- Travel dates and special requests
- Generated timestamp

## 🔧 Troubleshooting
- **No email client?** Details are copied to clipboard
- **EmailJS not working?** Check console for errors
- **Need help?** Contact info is always shown as backup

## 💡 Recommendation
**Start with current setup** (mailto) - it works perfectly!
**Upgrade to EmailJS later** for seamless experience.
