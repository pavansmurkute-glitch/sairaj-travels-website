# 📁 Sairaj Travels - File Manager

A comprehensive file management system for the admin panel that allows uploading, organizing, and managing photos and videos for the travel website.

## ✨ Features

### 🎯 **Core Functionality**
- **📁 Folder Management**: Create, browse, and organize folders
- **📤 File Upload**: Drag-and-drop or click to upload multiple files
- **🗂️ File Organization**: Organize files in custom folder structure
- **🔍 Search**: Search files and folders by name
- **👁️ View Modes**: Grid and list view options
- **📊 Progress Tracking**: Real-time upload progress indicators

### 🛡️ **Security & Validation**
- **File Type Validation**: Only allows images, videos, and documents
- **Size Limits**: Configurable file size limits (default: 100MB)
- **Filename Sanitization**: Removes invalid characters from filenames
- **Duplicate Handling**: Automatically renames duplicate files

### 🎨 **User Experience**
- **Modern UI**: Clean, professional interface with animations
- **Responsive Design**: Works on desktop and mobile devices
- **Breadcrumb Navigation**: Easy folder navigation
- **Drag & Drop**: Intuitive file upload experience
- **Real-time Feedback**: Success/error notifications

## 📂 Folder Structure

The file manager organizes files in the following structure:
```
/images/
├── vehicle/          # Vehicle photos
├── driver/           # Driver photos
├── packages/         # Package/tour photos
├── gallery/          # Gallery images
├── video_gallery/    # Video content
└── [custom folders]/ # Admin-created folders
```

## 🔧 Technical Implementation

### Frontend Components
- **`AdminFileManager.jsx`**: Main file manager interface
- **`FileUploadComponent.jsx`**: Reusable upload component
- **Navigation Integration**: Added to admin menu

### Backend APIs
- **`FileManagerController.java`**: RESTful API endpoints
- **`FileUploadConfig.java`**: Upload configuration

### API Endpoints
```
GET    /api/admin/files/browse        # Browse folder contents
POST   /api/admin/files/create-folder # Create new folder
POST   /api/admin/files/upload        # Upload files
DELETE /api/admin/files/delete        # Delete files/folders
GET    /api/admin/files/download      # Download files
GET    /api/admin/files/info          # Get file information
```

## 📋 Usage Guide

### Accessing File Manager
1. Login to admin panel
2. Navigate to **File Manager** from the admin menu
3. You'll see the main file management interface

### Creating Folders
1. Click **"New Folder"** button
2. Enter folder name (will be sanitized automatically)
3. Click **"Create"** to create the folder

### Uploading Files
1. **Drag & Drop**: Drag files directly onto the upload area
2. **Click Upload**: Click "Upload Files" button to select files
3. **Progress**: Watch real-time upload progress
4. **Results**: See success/error notifications

### Organizing Files
1. **Navigate**: Click folders to browse contents
2. **Breadcrumbs**: Use breadcrumb navigation to go back
3. **Search**: Use search box to find specific files
4. **View Modes**: Toggle between grid and list views

### File Operations
- **Delete**: Hover over files to see delete button
- **Download**: Click download button for individual files
- **Info**: View file details and properties

## ⚙️ Configuration

### File Size Limits
- **Images**: Up to 10MB recommended
- **Videos**: Up to 100MB (configurable)
- **Total Request**: Up to 500MB for multiple files

### Supported File Types
- **Images**: JPG, JPEG, PNG, GIF, WebP, BMP
- **Videos**: MP4, AVI, MOV, WMV, FLV, MKV, WebM
- **Documents**: PDF, DOC, DOCX, TXT

### Customization
- Modify `FileUploadConfig.java` for size limits
- Update `FileManagerController.java` for allowed file types
- Customize UI in `AdminFileManager.jsx`

## 🔒 Security Features

- **Admin Only**: Requires admin authentication
- **File Type Validation**: Prevents malicious file uploads
- **Path Sanitization**: Prevents directory traversal attacks
- **Filename Sanitization**: Removes dangerous characters
- **Size Limits**: Prevents server overload

## 🚀 Future Enhancements

- **Image Thumbnails**: Generate and display image previews
- **Bulk Operations**: Select and operate on multiple files
- **File Versioning**: Keep track of file versions
- **Integration**: Direct integration with vehicle/driver management
- **Cloud Storage**: Option to use cloud storage providers
- **Image Optimization**: Automatic image compression and optimization

## 📞 Support

For issues or feature requests related to the File Manager:
1. Check the browser console for errors
2. Verify file types and sizes are within limits
3. Ensure admin authentication is working
4. Contact development team for technical support

---

**Built with ❤️ for Sairaj Travels**
