// Configuration for the frontend application
// This file handles environment variables for different environments

// Directly use the production configuration in production mode
// This ensures the correct URLs are used in the deployed application
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://ecommerce-store-windsurf.onrender.com/api'
  : process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Log the current environment and API URL for debugging
console.log('Current environment:', process.env.NODE_ENV);
console.log('Using API URL:', API_URL);

// Razorpay Key ID for payment integration
const RAZORPAY_KEY_ID = process.env.NODE_ENV === 'production'
  ? 'rzp_test_tHLftLa9DvBJyg'
  : process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_tHLftLa9DvBJyg';

// Google OAuth Client ID
const GOOGLE_CLIENT_ID = process.env.NODE_ENV === 'production'
  ? '652447041636-1bsvl5ifrkr8iut9nkabj3ju551k12dm.apps.googleusercontent.com'
  : process.env.REACT_APP_GOOGLE_CLIENT_ID || '652447041636-1bsvl5ifrkr8iut9nkabj3ju551k12dm.apps.googleusercontent.com';

// Export individual configuration variables for direct imports
export { API_URL, RAZORPAY_KEY_ID, GOOGLE_CLIENT_ID };

// Also export the full configuration object
const config = {
  API_URL,
  RAZORPAY_KEY_ID,
  GOOGLE_CLIENT_ID,
  
  // Add other configuration variables as needed
  IMAGE_PLACEHOLDER: 'https://via.placeholder.com/300',
  
  // Feature flags
  FEATURES: {
    GOOGLE_AUTH: true,
    RAZORPAY_PAYMENT: true,
    CLOUDINARY_UPLOAD: true
  }
};

export default config;
