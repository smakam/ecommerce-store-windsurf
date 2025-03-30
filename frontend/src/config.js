// Configuration for the frontend application
// This file handles environment variables for different environments

// Import production config if in production mode
let productionConfig = null;
if (process.env.NODE_ENV === 'production') {
  try {
    productionConfig = require('./config.production').default;
    console.log('Using production configuration');
  } catch (error) {
    console.error('Failed to load production config:', error);
  }
}

// API URL - use production config, env var, or default to localhost
const API_URL = (productionConfig && productionConfig.API_URL) || 
                process.env.REACT_APP_API_URL || 
                'http://localhost:5001/api';

// Razorpay Key ID for payment integration
const RAZORPAY_KEY_ID = (productionConfig && productionConfig.RAZORPAY_KEY_ID) || 
                        process.env.REACT_APP_RAZORPAY_KEY_ID || 
                        'rzp_test_tHLftLa9DvBJyg';

// Google OAuth Client ID
const GOOGLE_CLIENT_ID = (productionConfig && productionConfig.GOOGLE_CLIENT_ID) || 
                         process.env.REACT_APP_GOOGLE_CLIENT_ID || 
                         '652447041636-1bsvl5ifrkr8iut9nkabj3ju551k12dm.apps.googleusercontent.com';

// Export configuration variables
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
