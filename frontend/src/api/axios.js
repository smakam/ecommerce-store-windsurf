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

// Log all requests for debugging
console.log('Axios instance created with baseURL:', config.API_URL);

// Add a request interceptor to include the auth token in all requests
api.interceptors.request.use(
  (config) => {
    console.log('Request interceptor called for URL:', config.url);
    
    // Add a timestamp to GET requests to prevent caching issues
    if (config.method === 'get') {
      config.params = { ...config.params, _t: new Date().getTime() };
    }
    
    const userInfo = localStorage.getItem('userInfo');
    console.log('userInfo in localStorage:', userInfo ? 'exists' : 'does not exist');
    
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        console.log('Parsed userInfo:', { 
          ...parsedUserInfo, 
          token: parsedUserInfo.token ? `${parsedUserInfo.token.substring(0, 20)}...` : 'none' 
        });
        
        // Get token from userInfo
        let token = parsedUserInfo.token;
        
        // Check if token exists and is properly formatted
        if (token) {
          // Make sure token doesn't already have 'Bearer ' prefix
          if (token.startsWith('Bearer ')) {
            token = token.slice(7);
          }
          
          console.log('Adding token to request headers');
          config.headers.Authorization = `Bearer ${token}`;
          console.log('Authorization header set:', `Bearer ${token.substring(0, 20)}...`);
        } else {
          console.log('No token found in userInfo');
        }
      } catch (error) {
        console.error('Error parsing userInfo from localStorage:', error);
      }
    } else {
      console.log('No userInfo found in localStorage');
    }
    
    console.log('Final request config:', {
      url: config.url,
      method: config.method,
      headers: { ...config.headers, Authorization: config.headers.Authorization ? 'Bearer token exists' : 'No Bearer token' }
    });
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
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
