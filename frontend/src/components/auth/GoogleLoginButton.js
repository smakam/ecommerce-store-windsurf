import React from 'react';
import { Button } from 'react-bootstrap';
import { FaGoogle } from 'react-icons/fa';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    // Determine the correct API URL based on the environment
    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://ecommerce-store-windsurf.onrender.com/api'
      : process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
    
    // Construct the Google Auth URL
    const googleAuthUrl = `${baseUrl}/auth/google`;
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Opening Google Auth URL:', googleAuthUrl);
    
    // Open the Google Auth URL
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
