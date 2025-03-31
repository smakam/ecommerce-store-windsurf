import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { googleLoginSuccess } from '../redux/slices/authSlice';
import { Spinner, Container, Alert } from 'react-bootstrap';

const TokenRedirect = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const processTokenAndRedirect = () => {
      try {
        console.log('TokenRedirect: Starting token processing');
        
        // Get hash fragment
        const hashFragment = window.location.hash;
        console.log('TokenRedirect: Hash fragment:', hashFragment);
        
        if (!hashFragment || hashFragment === '#') {
          console.error('TokenRedirect: No token found in URL');
          return;
        }
        
        // Remove the # character
        const hashContent = hashFragment.substring(1);
        
        // Parse the hash content
        const params = new URLSearchParams(hashContent);
        const token = params.get('token');
        
        if (!token) {
          console.error('TokenRedirect: Token parameter not found in hash');
          return;
        }
        
        console.log('TokenRedirect: Token found, length:', token.length);
        
        // Store in localStorage
        const userInfo = {
          token,
          isAuthenticated: true,
          loginTime: new Date().toISOString(),
          source: 'google_oauth'
        };
        
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        console.log('TokenRedirect: Token stored in localStorage');
        
        // Format user data for Redux
        const userData = {
          token,
          isAuthenticated: true,
          loginTime: new Date().toISOString(),
          source: 'google_oauth'
        };
        
        // Update Redux state
        dispatch(googleLoginSuccess(userData));
        console.log('TokenRedirect: Redux state updated with formatted user data');
        
        // Redirect to home page
        setTimeout(() => {
          console.log('TokenRedirect: Redirecting to homepage');
          navigate('/');
        }, 1500);
      } catch (error) {
        console.error('TokenRedirect: Error processing token:', error);
      }
    };
    
    processTokenAndRedirect();
  }, [navigate, dispatch]);
  
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
      <Spinner animation="border" role="status" style={{ width: '3rem', height: '3rem' }} />
      <h3 className="mt-3">Completing login...</h3>
      <Alert variant="info" className="mt-3">
        Please wait while we complete your Google login. You will be redirected automatically.
      </Alert>
    </Container>
  );
};

export default TokenRedirect;
