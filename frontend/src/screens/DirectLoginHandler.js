import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DirectLoginHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Function to handle the login process
    const handleLogin = () => {
      try {
        // Extract token from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        console.log('DirectLoginHandler: Processing token');
        
        if (!token) {
          console.error('No token found in URL');
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
        
        console.log('Login successful, redirecting to homepage');
        
        // Redirect immediately
        navigate('/');
      } catch (error) {
        console.error('Error during login process:', error);
        // Still try to redirect to home even if there's an error
        navigate('/');
      }
    };

    // Run the login handler
    handleLogin();
  }, [navigate]);
  
  // Return a minimal component
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <h2>Processing Login</h2>
      <p>Please wait while we log you in...</p>
    </div>
  );
};

export default DirectLoginHandler;
