# 🚀 Sairaj Travels - Production Deployment Guide

## 📋 **DEPLOYMENT CHECKLIST**

### **1. Azure Database Setup**

**Step 1: Create Azure SQL Database**
1. Go to Azure Portal
2. Create SQL Database
3. Note down:
   - Server name: `your-server.database.windows.net`
   - Database name: `sairaj-travels`
   - Username: `your-username`
   - Password: `your-password`

**Step 2: Run Database Script**
```sql
-- Execute this in Azure SQL Database
-- File: backend/src/main/resources/sql/create_user_management_tables_sqlserver.sql
```

**Step 3: Update Production Config**
- Edit `backend/src/main/resources/application-prod.properties`
- Replace `YOUR_AZURE_SERVER`, `YOUR_DATABASE_NAME`, `YOUR_AZURE_USERNAME`, `YOUR_AZURE_PASSWORD`

### **2. Render Backend Deployment**

**Step 1: Create Render Service**
1. Go to Render Dashboard
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `sairaj-travels-backend`
   - **Environment**: `Java`
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/sairaj-travels-backend-0.0.1-SNAPSHOT.jar`

**Step 2: Environment Variables**
```
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:sqlserver://YOUR_AZURE_SERVER.database.windows.net:1433;database=YOUR_DATABASE_NAME;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;
SPRING_DATASOURCE_USERNAME=YOUR_AZURE_USERNAME
SPRING_DATASOURCE_PASSWORD=YOUR_AZURE_PASSWORD
```

**Step 3: Deploy**
- Click "Deploy"
- Wait for build to complete
- Note the backend URL: `https://your-backend-app.onrender.com`

### **3. Render Frontend Deployment**

**Step 1: Create Static Site**
1. Go to Render Dashboard
2. Click "New" → "Static Site"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `sairaj-travels-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

**Step 2: Environment Variables**
```
VITE_API_URL=https://your-backend-app.onrender.com
```

**Step 3: Deploy**
- Click "Deploy"
- Wait for build to complete
- Note the frontend URL: `https://your-frontend-app.onrender.com`

### **4. Update Configuration**

**Update Backend Config:**
```properties
# In application-prod.properties
app.frontend.url=https://your-frontend-app.onrender.com
```

**Update Frontend Config:**
```javascript
// In config.js - Update the production URL
const API_URL = import.meta.env.VITE_API_URL || 'https://your-backend-app.onrender.com';
```

## 🔧 **POST-DEPLOYMENT STEPS**

### **1. Test the System**
1. Visit your frontend URL
2. Test admin login
3. Test role management
4. Test file uploads
5. Test all features

### **2. Create Admin User**
1. Go to `/admin/login`
2. Use default credentials (if database script ran)
3. Go to User Management
4. Create your production admin user
5. Delete or change default credentials

### **3. Configure Domain (Optional)**
1. Add custom domain in Render
2. Update DNS settings
3. Update configuration files

## 🛡️ **SECURITY CHECKLIST**

- ✅ Demo credentials removed
- ✅ Database secured with Azure
- ✅ HTTPS enabled on Render
- ✅ Environment variables secured
- ✅ Role-based access control active
- ✅ Password hashing enabled

## 📊 **MONITORING**

### **Backend Health Check**
- URL: `https://your-backend-app.onrender.com/actuator/health`
- Should return: `{"status":"UP"}`

### **Frontend**
- URL: `https://your-frontend-app.onrender.com`
- Should load the Sairaj Travels website

## 🚨 **TROUBLESHOOTING**

### **Common Issues:**
1. **Database Connection**: Check Azure firewall rules
2. **Build Failures**: Check Java version in Render
3. **CORS Issues**: Verify frontend URL in backend config
4. **File Uploads**: Check Render file system permissions

### **Support:**
- Render Documentation: https://render.com/docs
- Azure SQL Documentation: https://docs.microsoft.com/en-us/azure/azure-sql/
- Spring Boot Documentation: https://spring.io/projects/spring-boot

## 🎉 **DEPLOYMENT COMPLETE!**

Your Sairaj Travels system is now live on:
- **Frontend**: `https://your-frontend-app.onrender.com`
- **Backend**: `https://your-backend-app.onrender.com`
- **Database**: Azure SQL Database

**Admin Access:**
- URL: `https://your-frontend-app.onrender.com/admin/login`
- Use your created admin credentials

**Features Available:**
- ✅ Complete website
- ✅ Admin panel with role-based access
- ✅ User management
- ✅ File management
- ✅ All existing features
