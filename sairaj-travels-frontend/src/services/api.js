import axios from "axios";
import overlayService from "./overlayService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "http://localhost:8080/api",
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

let pending = 0;
let requestStartTime = null;

const showIfNeeded = (message = 'Loading...') => {
  overlayService.show(message, 'loading');
};

const hideIfNeeded = () => {
  if (pending <= 0) {
    overlayService.hide();
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    pending += 1;
    requestStartTime = Date.now();
    
    // Show loading overlay for first request
    if (pending === 1) {
      const message = config.loadingMessage || 'Loading...';
      showIfNeeded(message);
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    pending = Math.max(0, pending - 1);
    hideIfNeeded();
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    pending = Math.max(0, pending - 1);
    
    // Calculate request duration
    const duration = requestStartTime ? Date.now() - requestStartTime : 0;
    
    // Show success message for important operations
    if (response.config.showSuccessMessage && response.status >= 200 && response.status < 300) {
      const message = response.config.successMessage || 'Operation completed successfully!';
      overlayService.showTemporary(message, 'success', 2000);
    }
    
    hideIfNeeded();
    return response;
  },
  (error) => {
    pending = Math.max(0, pending - 1);
    
    // Enhanced error handling
    let errorMessage = 'Something went wrong!';
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      switch (status) {
        case 400:
          errorMessage = 'Invalid request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please login again.';
          break;
        case 403:
          errorMessage = 'Access denied. You don\'t have permission.';
          break;
        case 404:
          errorMessage = 'Requested resource not found.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Error ${status}: ${error.response.data?.message || 'Unknown error'}`;
      }
    } else if (error.request) {
      // Network error
      errorMessage = 'Network error. Please check your connection.';
    } else {
      // Other error
      errorMessage = error.message || 'An unexpected error occurred.';
    }
    
    // Show error message
    overlayService.showError(errorMessage);
    
    hideIfNeeded();
    return Promise.reject(error);
  }
);

// Enhanced API methods
export const apiMethods = {
  // GET with loading message
  get: (url, config = {}) => {
    return api.get(url, {
      ...config,
      loadingMessage: config.loadingMessage || 'Loading data...'
    });
  },
  
  // POST with success message
  post: (url, data, config = {}) => {
    return api.post(url, data, {
      ...config,
      loadingMessage: config.loadingMessage || 'Saving data...',
      showSuccessMessage: true,
      successMessage: config.successMessage || 'Data saved successfully!'
    });
  },
  
  // PUT with success message
  put: (url, data, config = {}) => {
    return api.put(url, data, {
      ...config,
      loadingMessage: config.loadingMessage || 'Updating data...',
      showSuccessMessage: true,
      successMessage: config.successMessage || 'Data updated successfully!'
    });
  },
  
  // DELETE with confirmation
  delete: (url, config = {}) => {
    return api.delete(url, {
      ...config,
      loadingMessage: config.loadingMessage || 'Deleting data...',
      showSuccessMessage: true,
      successMessage: config.successMessage || 'Data deleted successfully!'
    });
  }
};

export default api;
