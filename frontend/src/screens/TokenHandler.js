import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';

const TokenHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Function to extract token from URL fragment
    const handleToken = () => {
      try {
        console.log('TokenHandler: Processing URL fragment');
        
        // Get token from URL fragment
        const hash = window.location.hash.substring(1); // Remove the # character
        const params = new URLSearchParams(hash);
        const token = params.get('token');
        
        console.log('Token from URL fragment:', token ? 'exists' : 'missing');
        
        if (!token) {
          console.error('No token found in URL fragment');
          navigate('/login');
          return;
        }
        
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
        
        console.log('Login successful, redirecting to homepage');
        navigate('/');
      } catch (error) {
        console.error('Error processing token:', error);
        navigate('/login');
      }
    };

    // Run the token handler
    handleToken();
  }, [navigate]);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="text-center">
        <h2>Finalizing Login</h2>
        <p>Please wait while we complete your login...</p>
        <Spinner animation="border" variant="primary" />
      </div>
    </Container>
  );
};

export default TokenHandler;
