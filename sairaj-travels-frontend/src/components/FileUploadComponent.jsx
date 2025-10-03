import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpTrayIcon, 
  XMarkIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';

const FileUploadComponent = ({ 
  onUpload, 
  accept = "image/*,video/*", 
  multiple = true, 
  maxFileSize = 100 * 1024 * 1024, // 100MB
  className = "",
  disabled = false 
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadResults, setUploadResults] = useState([]);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (files) => {
    if (!files || files.length === 0) return;

    const validFiles = [];
    const errors = [];

    Array.from(files).forEach(file => {
      if (file.size > maxFileSize) {
        errors.push(`${file.name} is too large (max ${formatFileSize(maxFileSize)})`);
        return;
      }
      validFiles.push(file);
    });

    if (errors.length > 0) {
      setUploadResults(prev => [...prev, ...errors.map(error => ({ error, type: 'error' }))]);
    }

    if (validFiles.length > 0) {
      uploadFiles(validFiles);
    }
  };

  // Upload files with progress tracking
  const uploadFiles = async (files) => {
    setUploading(true);
    setUploadResults([]);

    // Initialize progress for all files
    const progressMap = {};
    files.forEach(file => {
      progressMap[file.name] = 0;
    });
    setUploadProgress(progressMap);

    try {
      // Simulate progress updates (replace with actual upload logic)
      for (let file of files) {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: progress
          }));
        }
      }

      // Call the actual upload function
      if (onUpload) {
        await onUpload(files);
      }

      // Show success messages
      const successResults = files.map(file => ({
        message: `${file.name} uploaded successfully`,
        type: 'success'
      }));
      setUploadResults(successResults);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadResults([{
        error: 'Upload failed: ' + error.message,
        type: 'error'
      }]);
    } finally {
      setUploading(false);
      setUploadProgress({});
      
      // Clear results after 5 seconds
      setTimeout(() => {
        setUploadResults([]);
      }, 5000);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (!disabled) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  // File input change handler
  const handleInputChange = (e) => {
    handleFileSelect(e.target.files);
    e.target.value = ''; // Reset input
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
          ${dragOver && !disabled 
            ? 'border-blue-500 bg-blue-50' 
            : disabled 
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center">
          <ArrowUpTrayIcon 
            className={`w-12 h-12 mb-4 ${
              dragOver && !disabled ? 'text-blue-500' : disabled ? 'text-gray-300' : 'text-gray-400'
            }`} 
          />
          
          <p className={`text-lg font-medium mb-2 ${
            dragOver && !disabled ? 'text-blue-700' : disabled ? 'text-gray-400' : 'text-gray-900'
          }`}>
            {dragOver && !disabled 
              ? 'Drop files here to upload' 
              : disabled 
              ? 'Upload disabled' 
              : 'Drag and drop files here, or click to select'
            }
          </p>
          
          <p className="text-sm text-gray-500">
            {accept.includes('image') && accept.includes('video') 
              ? 'Supports images and videos' 
              : accept.includes('image') 
              ? 'Supports images only' 
              : 'Supports videos only'
            } (max {formatFileSize(maxFileSize)})
          </p>
        </div>
      </div>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploading && Object.keys(uploadProgress).length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-3"
          >
            <h4 className="font-medium text-gray-900">Uploading Files...</h4>
            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              <div key={fileName} className="bg-white p-3 rounded-lg border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 truncate flex-1 mr-4">
                    {fileName}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Results */}
      <AnimatePresence>
        {uploadResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {uploadResults.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-3 rounded-lg flex items-center ${
                  result.type === 'success' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                {result.type === 'success' ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                ) : (
                  <ExclamationCircleIcon className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                )}
                <span className={`text-sm ${
                  result.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.message || result.error}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploadComponent;
