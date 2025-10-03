// Production API Configuration
const isProduction = import.meta.env.PROD;
const API_URL = import.meta.env.VITE_API_URL || (isProduction ? 'https://your-backend-app.onrender.com' : 'http://localhost:8080');

export const IMAGE_BASE_URL = `${API_URL}/`;
export const API_BASE_URL = API_URL;