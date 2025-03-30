import React from 'react';
import { Button } from 'react-bootstrap';
import { FaGoogle } from 'react-icons/fa';
import { API_URL } from '../../config';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    // Use window.open to open a new tab/window for the Google OAuth flow
    window.open(`${API_URL}/auth/google`, '_self');
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
