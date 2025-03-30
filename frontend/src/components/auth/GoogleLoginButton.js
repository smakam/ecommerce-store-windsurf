import React from 'react';
import { Button } from 'react-bootstrap';
import { FaGoogle } from 'react-icons/fa';
import { API_URL } from '../../config';

const GoogleLoginButton = () => {
  // Log the API URL to see what's being used
  console.log('Current API_URL:', API_URL);
  console.log('Environment:', process.env.NODE_ENV);
  
  const handleGoogleLogin = () => {
    // Use window.open to open a new tab/window for the Google OAuth flow
    const googleAuthUrl = `${API_URL}/auth/google`;
    console.log('Opening Google Auth URL:', googleAuthUrl);
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
