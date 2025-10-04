import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Simple icon components as fallback
const SimpleIcon = ({ type, className = "w-6 h-6" }) => {
  const icons = {
    folder: "📁",
    photo: "🖼️", 
    video: "🎥",
    document: "📄",
    plus: "➕",
    trash: "🗑️",
    upload: "📤",
    folderPlus: "📁➕",
    search: "🔍",
    grid: "⊞",
    list: "☰",
    home: "🏠",
    chevronRight: "▶"
  };
  
  return <span className={`inline-block ${className}`} style={{fontSize: '1.2em'}}>{icons[type] || "📄"}</span>;
};

const AdminFileManager = () => {
  const navigate = useNavigate();
  
  // State Management
  const [currentPath, setCurrentPath] = useState('');
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragOver, setDragOver] = useState(false);

  // Breadcrumb navigation
  const breadcrumbs = currentPath ? currentPath.split('/').filter(Boolean) : [];

  // Load folder contents
  const loadFolderContents = useCallback(async (path = '') => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/admin/files/browse?path=${encodeURIComponent(path)}`);
      const data = await response.json();
      setFolders(data.folders || []);
      setFiles(data.files || []);
      setCurrentPath(path);
    } catch (error) {
      console.error('Error loading folder contents:', error);
      // Fallback to mock data for development
      setFolders([
        { name: 'vehicle', type: 'folder', createdAt: new Date().toISOString() },
        { name: 'driver', type: 'folder', createdAt: new Date().toISOString() },
        { name: 'packages', type: 'folder', createdAt: new Date().toISOString() },
        { name: 'gallery', type: 'folder', createdAt: new Date().toISOString() }
      ]);
      setFiles([
        { name: 'sample1.jpg', type: 'image', size: 245760, createdAt: new Date().toISOString() },
        { name: 'sample2.mp4', type: 'video', size: 5242880, createdAt: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadFolderContents();
  }, [loadFolderContents]);

  // Create new folder
  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/admin/files/create-folder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: currentPath,
          name: newFolderName.trim()
        })
      });
      
      if (response.ok) {
        setNewFolderName('');
        setShowCreateFolder(false);
        loadFolderContents(currentPath);
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      // Mock success for development
      setFolders(prev => [...prev, {
        name: newFolderName.trim(),
        type: 'folder',
        createdAt: new Date().toISOString()
      }]);
      setNewFolderName('');
      setShowCreateFolder(false);
    }
  };

  // Navigate to folder
  const navigateToFolder = (folderName) => {
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    loadFolderContents(newPath);
  };

  // Navigate to parent
  const navigateToParent = () => {
    const parentPath = currentPath.split('/').slice(0, -1).join('/');
    loadFolderContents(parentPath);
  };

  // Navigate to specific breadcrumb
  const navigateToBreadcrumb = (index) => {
    const newPath = breadcrumbs.slice(0, index + 1).join('/');
    loadFolderContents(newPath);
  };

  // Handle file upload
  const handleFileUpload = async (files) => {
    const formData = new FormData();
    formData.append('path', currentPath);
    
    Array.from(files).forEach((file, index) => {
      formData.append('files', file);
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: 0
      }));
    });

    try {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          Array.from(files).forEach(file => {
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: progress
            }));
          });
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200) {
          loadFolderContents(currentPath);
          setUploadProgress({});
        }
      };

      xhr.open('POST', `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/admin/files/upload`);
      xhr.send(formData);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress({});
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  // File type icon
  const getFileIcon = (file) => {
    if (file.type === 'folder') return <SimpleIcon type="folder" className="w-8 h-8 text-blue-500" />;
    if (file.type === 'image' || file.name?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      return <SimpleIcon type="photo" className="w-8 h-8 text-green-500" />;
    }
    if (file.type === 'video' || file.name?.toLowerCase().match(/\.(mp4|mov|avi|mkv)$/)) {
      return <SimpleIcon type="video" className="w-8 h-8 text-red-500" />;
    }
    return <SimpleIcon type="document" className="w-8 h-8 text-gray-500" />;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Filter items based on search
  const filteredFolders = folders.filter(folder => 
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="mr-4 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center text-sm text-gray-600 hover:text-gray-800"
                  >
                    <span className="mr-1">←</span> Back to Dashboard
                  </button>
                  <SimpleIcon type="folder" className="w-8 h-8 text-blue-600 mr-3" />
                  <h1 className="text-2xl font-bold text-gray-900">File Manager</h1>
                </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <SimpleIcon type="search" className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search files and folders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <SimpleIcon type="grid" className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <SimpleIcon type="list" className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm">
              <button
                onClick={() => loadFolderContents('')}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <SimpleIcon type="home" className="w-4 h-4 mr-1" />
                Home
              </button>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <SimpleIcon type="chevronRight" className="w-4 h-4 text-gray-400" />
                  <button
                    onClick={() => navigateToBreadcrumb(index)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {crumb}
                  </button>
                </React.Fragment>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCreateFolder(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <SimpleIcon type="folderPlus" className="w-5 h-5 mr-2" />
                New Folder
              </button>
              
              <label className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                <SimpleIcon type="upload" className="w-5 h-5 mr-2" />
                Upload Files
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  accept="image/*,video/*"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          } border-2 border-dashed rounded-lg p-8 text-center transition-colors mb-8`}
        >
          <SimpleIcon type="upload" className={`w-12 h-12 mx-auto mb-4 ${dragOver ? 'text-blue-500' : 'text-gray-400'}`} />
          <p className={`text-lg font-medium ${dragOver ? 'text-blue-700' : 'text-gray-900'}`}>
            {dragOver ? 'Drop files here to upload' : 'Drag and drop files here, or click Upload Files'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Supports images (JPG, PNG, GIF) and videos (MP4, MOV, AVI)
          </p>
        </div>

        {/* Upload Progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Uploading Files</h3>
            <div className="space-y-3">
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <div key={fileName} className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{fileName}</span>
                    <span className="text-sm text-gray-500">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading files...</p>
          </div>
        )}

        {/* File Grid/List */}
        {!loading && (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4' : 'space-y-2'}>
            {/* Folders */}
            {filteredFolders.map((folder) => (
              <motion.div
                key={folder.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`${
                  viewMode === 'grid'
                    ? 'bg-white p-4 rounded-lg shadow-sm border hover:shadow-md cursor-pointer transition-all'
                    : 'bg-white p-3 rounded-lg shadow-sm border hover:shadow-md cursor-pointer transition-all flex items-center space-x-3'
                }`}
                onClick={() => navigateToFolder(folder.name)}
              >
                <div className={`${viewMode === 'grid' ? 'text-center' : 'flex items-center flex-1'}`}>
                  <div className={viewMode === 'grid' ? 'mb-3' : 'mr-3'}>
                    <SimpleIcon type="folder" className="w-12 h-12 text-blue-500 mx-auto" />
                  </div>
                  <div className={viewMode === 'list' ? 'flex-1' : ''}>
                    <h3 className="font-medium text-gray-900 truncate">{folder.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(folder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Files */}
            {filteredFiles.map((file) => (
              <motion.div
                key={file.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`${
                  viewMode === 'grid'
                    ? 'bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-all group'
                    : 'bg-white p-3 rounded-lg shadow-sm border hover:shadow-md transition-all flex items-center space-x-3 group'
                }`}
              >
                <div className={`${viewMode === 'grid' ? 'text-center' : 'flex items-center flex-1'}`}>
                  <div className={viewMode === 'grid' ? 'mb-3' : 'mr-3'}>
                    {getFileIcon(file)}
                  </div>
                  <div className={viewMode === 'list' ? 'flex-1' : ''}>
                    <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {file.size && formatFileSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 text-red-600 hover:text-red-800">
                      <SimpleIcon type="trash" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredFolders.length === 0 && filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <SimpleIcon type="folder" className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No files or folders</h3>
            <p className="text-gray-500 mb-6">Get started by creating a folder or uploading files</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowCreateFolder(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Folder
              </button>
              <label className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                Upload Files
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Create Folder Modal */}
      <AnimatePresence>
        {showCreateFolder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateFolder(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Folder</h3>
              <input
                type="text"
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createFolder()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                autoFocus
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateFolder(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createFolder}
                  disabled={!newFolderName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminFileManager;
