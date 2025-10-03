# 🎯 Create New Database for Sairaj Travels

## Using Your Existing Azure SQL Server

You already have:
- **SQL Server**: `sanjtiksha-sqlserver.database.windows.net`
- **Resource Group**: `sanjtiksha-rg`

## 📋 Step-by-Step Instructions

### **1. Create New Database**

1. **Go to Azure Portal**
   - Visit: https://portal.azure.com
   - Sign in with your Azure account

2. **Navigate to Your SQL Server**
   - Go to "All resources"
   - Find and click on `sanjtiksha-sqlserver`

3. **Create New Database**
   - Click **"+ New database"** or **"Create database"**
   - **Database name**: `sairaj-travels-db`
   - **Server**: `sanjtiksha-sqlserver` (already selected)
   - **Want to use SQL elastic pool?**: **No**
   - **Compute + storage**: Click **"Configure database"**
     - Choose **"Basic"** (5 DTU, 2 GB storage) for testing
     - Or **"Standard"** for production
     - Click **"Apply"**
   - **Backup storage redundancy**: **Locally-redundant backup storage**
   - Click **"Review + create"**
   - Click **"Create"**

4. **Wait for Creation**
   - Wait 2-3 minutes for the database to be created
   - You'll see a notification when it's ready

### **2. Configure Firewall (if needed)**

1. **Go to Database Security**
   - Click on your new database `sairaj-travels-db`
   - Go to **"Networking"** in the left menu

2. **Add Firewall Rules**
   - **"Add your current client IP address"**: Click this
   - **"Allow Azure services and resources"**: Set to **"Yes"**
   - Click **"Save"**

### **3. Run the Database Script**

1. **Open Query Editor**
   - Go to your new database `sairaj-travels-db`
   - Click **"Query editor"** in the left menu
   - Login with your server admin credentials

2. **Run the Script**
   - Copy the entire `AZURE_DATABASE_SETUP.sql` script
   - Paste it in the query editor
   - Click **"Run"**

3. **Verify Success**
   - You should see: "SAIRAJ TRAVELS DATABASE SETUP COMPLETE!"
   - Default admin created: `admin` / `admin123`

### **4. Get Your Connection Details**

**Note down these details for Render deployment:**

- **Server**: `sanjtiksha-sqlserver.database.windows.net`
- **Database**: `sairaj-travels-db`
- **Username**: `[your server admin username]`
- **Password**: `[your server admin password]`

## 🚀 Next Steps

1. **Test the Database**
   - Verify tables were created
   - Test admin login

2. **Deploy to Render**
   - Use the connection details above
   - Follow the main deployment guide

## ✅ What You'll Have

After running the script, your database will have:
- ✅ User management system (4 roles)
- ✅ Admin user (admin/admin123)
- ✅ All business tables
- ✅ Sample data
- ✅ Password reset system

**Ready to create the database?** Let me know when it's done! 🎯
