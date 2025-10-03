# 🚀 Sairaj Travels - Render Deployment Guide

## 📋 **DEPLOYMENT CHECKLIST - READY TO DEPLOY!**

### ✅ **Backend Deployment Ready:**
- ✅ JAR file: `target/sairaj-travels-backend-0.0.1-SNAPSHOT.jar`
- ✅ Configuration: `render.yaml` ready
- ✅ Database: Azure SQL connection configured
- ✅ Build command: `./mvnw clean package -DskipTests`
- ✅ Start command: `java -jar target/sairaj-travels-backend-0.0.1-SNAPSHOT.jar`

### ✅ **Frontend Deployment Ready:**
- ✅ Build directory: `sairaj-travels-frontend/dist/`
- ✅ Configuration: `sairaj-travels-frontend/render.yaml` ready
- ✅ Build command: `npm install && npm run build`
- ✅ API URL: Configurable via environment variables

---

## 🎯 **STEP-BY-STEP RENDER DEPLOYMENT**

### **STEP 1: Deploy Backend to Render**

1. **Go to Render Dashboard:**
   - Visit: https://dashboard.render.com/
   - Sign in to your account

2. **Create New Web Service:**
   - Click "New +" button
   - Select "Web Service"

3. **Connect Repository:**
   - Connect your GitHub repository
   - Select your "Sairaj Travel Website" repository

4. **Backend Configuration:**
   ```
   Name: sairaj-travels-backend
   Environment: Java
   Build Command: ./mvnw clean package -DskipTests
   Start Command: java -jar target/sairaj-travels-backend-0.0.1-SNAPSHOT.jar
   ```

5. **Environment Variables:**
   ```
   SPRING_PROFILES_ACTIVE=prod
   SPRING_DATASOURCE_URL=jdbc:sqlserver://sairaj-sqlserver.database.windows.net:1433;database=SairajTravelsDB;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;
   SPRING_DATASOURCE_USERNAME=sairajadmin@sairaj-sqlserver
   SPRING_DATASOURCE_PASSWORD=Deep@6044
   SPRING_DATASOURCE_DRIVER_CLASS_NAME=com.microsoft.sqlserver.jdbc.SQLServerDriver
   SPRING_JPA_HIBERNATE_DDL_AUTO=update
   SPRING_JPA_SHOW_SQL=false
   SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT=org.hibernate.dialect.SQLServerDialect
   ```

6. **Deploy:**
   - Click "Create Web Service"
   - Wait for build (5-10 minutes)
   - Note the backend URL (e.g., https://sairaj-travels-backend.onrender.com)

---

### **STEP 2: Deploy Frontend to Render**

1. **Create New Static Site:**
   - Click "New +" button
   - Select "Static Site"

2. **Connect Repository:**
   - Connect your GitHub repository
   - Select your "Sairaj Travel Website" repository

3. **Frontend Configuration:**
   ```
   Name: sairaj-travels-frontend
   Build Command: cd sairaj-travels-frontend && npm install && npm run build
   Publish Directory: sairaj-travels-frontend/dist
   ```

4. **Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

5. **Deploy:**
   - Click "Create Static Site"
   - Wait for build (3-5 minutes)
   - Note the frontend URL (e.g., https://sairaj-travels-frontend.onrender.com)

---

## 🔧 **POST-DEPLOYMENT STEPS**

### **1. Update Frontend API URL:**
- After backend deployment, update frontend environment variable
- Use the actual backend URL from Render

### **2. Test the Application:**
- Visit your frontend URL
- Test all features
- Verify Azure database connection

### **3. Custom Domain (Optional):**
- Add custom domain in Render dashboard
- Update DNS settings

---

## 📊 **EXPECTED DEPLOYMENT TIMELINE**

- **Backend Build**: 5-10 minutes
- **Frontend Build**: 3-5 minutes
- **Total Time**: 10-15 minutes

---

## 🎉 **SUCCESS INDICATORS**

### **Backend Success:**
- ✅ Build completes without errors
- ✅ Health check accessible: `https://your-backend.onrender.com/actuator/health`
- ✅ API endpoints working: `https://your-backend.onrender.com/api/vehicles`

### **Frontend Success:**
- ✅ Build completes without errors
- ✅ Website loads: `https://your-frontend.onrender.com`
- ✅ API calls working (check browser network tab)

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues:**
1. **Build Fails**: Check environment variables
2. **Database Connection**: Verify Azure SQL credentials
3. **API Not Working**: Check CORS configuration
4. **Frontend Not Loading**: Verify API URL environment variable

### **Support:**
- Check Render build logs
- Verify environment variables
- Test API endpoints individually

---

## 🎯 **READY TO DEPLOY!**

Your application is **100% ready** for Render deployment with:
- ✅ Complete backend configuration
- ✅ Complete frontend configuration
- ✅ Azure database connection ready
- ✅ All dependencies resolved
- ✅ Production builds successful

**Start with Step 1 (Backend Deployment) now!**
