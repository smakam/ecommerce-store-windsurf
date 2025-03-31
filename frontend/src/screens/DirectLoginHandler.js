import React, { useEffect, useState } from 'react';
import { Container, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const DirectLoginHandler = () => {
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing login...');
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    console.log('DirectLoginHandler: Processing token');
    
    if (!token) {
      console.error('No token found in URL');
      setStatus('error');
      setMessage('No authentication token found. Please try again.');
      return;
    }
    
    try {
      // Store token in localStorage
      const userInfo = {
        token,
        isAuthenticated: true,
        loginTime: new Date().toISOString()
      };
      
      console.log('Storing user info in localStorage');
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      // Verify it was stored
      const storedInfo = localStorage.getItem('userInfo');
      if (!storedInfo) {
        throw new Error('Failed to store user info in localStorage');
      }
      
      console.log('Login successful, redirecting to homepage in 2 seconds');
      setStatus('success');
      setMessage('Login successful! Redirecting to homepage...');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      console.error('Error during login process:', error);
      setStatus('error');
      setMessage(`Authentication error: ${error.message}. Please try again.`);
    }
  }, [navigate]);
  
  const handleRetry = () => {
    window.location.href = '/api/auth/google';
  };
  
  const handleManualContinue = () => {
    navigate('/');
  };
  
  return (
    <Container className="text-center mt-5">
      <h2>Authentication</h2>
      
      {status === 'processing' && (
        <div>
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">{message}</p>
        </div>
      )}
      
      {status === 'success' && (
        <Alert variant="success">
          <Alert.Heading>Success!</Alert.Heading>
          <p>{message}</p>
        </Alert>
      )}
      
      {status === 'error' && (
        <Alert variant="danger">
          <Alert.Heading>Authentication Error</Alert.Heading>
          <p>{message}</p>
          <div className="d-flex justify-content-center mt-3">
            <Button variant="outline-primary" onClick={handleRetry} className="mx-2">
              Try Again
            </Button>
            <Button variant="outline-secondary" onClick={handleManualContinue} className="mx-2">
              Continue Anyway
            </Button>
          </div>
        </Alert>
      )}
      
      <div className="mt-4">
        <p>URL parameters: {window.location.search}</p>
      </div>
    </Container>
  );
};

export default DirectLoginHandler;
