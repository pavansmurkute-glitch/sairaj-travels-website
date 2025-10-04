let setter = null;
let currentMessage = '';
let currentType = 'loading'; // 'loading', 'success', 'error', 'warning'

const overlayService = {
  register: (setFn) => { setter = setFn; },
  
  // Basic show/hide
  show: (message = 'Loading...', type = 'loading') => { 
    if (setter) {
      currentMessage = message;
      currentType = type;
      setter({ visible: true, message, type });
    }
  },
  
  hide: () => { 
    if (setter) setter({ visible: false, message: '', type: 'loading' });
  },
  
  toggle: (visible, message = 'Loading...', type = 'loading') => { 
    if (setter) setter({ visible: !!visible, message, type });
  },
  
  // Enhanced methods
  showSuccess: (message = 'Success!') => {
    overlayService.show(message, 'success');
  },
  
  showError: (message = 'Something went wrong!') => {
    overlayService.show(message, 'error');
  },
  
  showWarning: (message = 'Warning!') => {
    overlayService.show(message, 'warning');
  },
  
  // Get current state
  getCurrentMessage: () => currentMessage,
  getCurrentType: () => currentType,
  
  // Auto-hide with timeout
  showTemporary: (message, type = 'success', duration = 3000) => {
    overlayService.show(message, type);
    setTimeout(() => overlayService.hide(), duration);
  }
};

export default overlayService;
