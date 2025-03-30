import React from 'react';
import { Button } from 'react-bootstrap';
import { FaGoogle } from 'react-icons/fa';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    // Determine the correct API URL based on the environment
    // In development, use the full URL with localhost and port
    // In production, use the Render backend URL
    const fullApiUrl = process.env.NODE_ENV === 'production'
      ? 'https://ecommerce-store-windsurf.onrender.com/api'
      : 'http://localhost:5001/api';
    
    // Construct the Google Auth URL with the complete URL
    const googleAuthUrl = `${fullApiUrl}/auth/google`;
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Opening Google Auth URL:', googleAuthUrl);
    
    // Open the Google Auth URL in the same window
    window.open(googleAuthUrl, '_self');
  };

  return (
    <Button 
      variant="light" 
      className="d-flex align-items-center justify-content-center w-100 mb-3 border"
      onClick={handleGoogleLogin}
    >
      <FaGoogle className="me-2" style={{ color: '#DB4437' }} />
      <span>Continue with Google</span>
    </Button>
  );
};

export default GoogleLoginButton;
