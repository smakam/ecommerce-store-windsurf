import axios from 'axios';
import config from '../config';

// Log the API URL being used
console.log('Creating axios instance with baseURL:', config.API_URL);

// Create an instance of axios with a custom config
const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout for better error handling
  timeout: 10000,
});

// Add a request interceptor to include the auth token in all requests
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    
    // Log detailed error information for debugging
    console.error('API Error:', {
      message: error.message,
      code: error.code,
      request: originalRequest ? `${originalRequest.method} ${originalRequest.url}` : 'No request config',
      response: error.response ? `Status: ${error.response.status}` : 'No response',
    });
    
    // Handle token expiration
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear user info from localStorage and redirect to login
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    
    // Handle network errors with a more specific message
    if (error.code === 'ERR_NETWORK') {
      error.message = 'Unable to connect to the server. Please check your internet connection or try again later.';
    }
    
    return Promise.reject(error);
  }
);

export default api;
