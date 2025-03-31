import React, { useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const GoogleAuthDebug = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Log basic information
    console.log('Debug page loaded');
    console.log('URL:', window.location.href);
    
    // Get token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      console.log('Token found in URL:', token.substring(0, 20) + '...');
      
      // Store token in localStorage
      try {
        localStorage.setItem('userInfo', JSON.stringify({
          token,
          isAuthenticated: true,
          loginTime: new Date().toISOString()
        }));
        console.log('Token stored in localStorage');
      } catch (error) {
        console.error('Error storing token:', error);
      }
    } else {
      console.log('No token found in URL');
    }
    
    // Check localStorage
    try {
      const storedInfo = localStorage.getItem('userInfo');
      console.log('localStorage userInfo exists:', !!storedInfo);
    } catch (error) {
      console.error('Error checking localStorage:', error);
    }
  }, []);
  
  const handleContinue = () => {
    // Get token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      // Store token in localStorage again to be sure
      localStorage.setItem('userInfo', JSON.stringify({
        token,
        isAuthenticated: true,
        loginTime: new Date().toISOString()
      }));
    }
    
    // Navigate to home
    navigate('/');
  };
  
  const handleRetry = () => {
    window.location.href = '/api/auth/google';
  };
  
  return (
    <Container className="text-center mt-5">
      <h2>Google OAuth Debug Page</h2>
      <p>Check browser console for debug information</p>
      <p>URL parameters: {window.location.search}</p>
      
      <div className="mt-4">
        <Button variant="primary" onClick={handleContinue} className="mx-2">
          Continue to Homepage
        </Button>
        <Button variant="secondary" onClick={handleRetry} className="mx-2">
          Retry Google Login
        </Button>
      </div>
    </Container>
  );
};

export default GoogleAuthDebug;
