import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { googleLoginSuccess } from '../redux/slices/authSlice';
import { Spinner, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import config from '../config';

const TokenRedirect = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processTokenAndRedirect = async () => {
      try {
        console.log('TokenRedirect: Starting token processing');
        
        // Get hash fragment
        const hashFragment = window.location.hash;
        console.log('TokenRedirect: Hash fragment:', hashFragment);
        
        if (!hashFragment || hashFragment === '#') {
          console.error('TokenRedirect: No token found in URL');
          setError('No token found in URL. Please try logging in again.');
          setLoading(false);
          return;
        }
        
        // Remove the # character
        const hashContent = hashFragment.substring(1);
        
        // Parse the hash content
        const params = new URLSearchParams(hashContent);
        const token = params.get('token');
        
        if (!token) {
          console.error('TokenRedirect: Token parameter not found in hash');
          setError('Token parameter not found. Please try logging in again.');
          setLoading(false);
          return;
        }
        
        console.log('TokenRedirect: Token found, length:', token.length);
        
        // First, store the token temporarily in localStorage so the axios interceptor can use it
        const tempUserInfo = { token };
        localStorage.setItem('userInfo', JSON.stringify(tempUserInfo));
        
        // Verify the token with the backend
        try {
          console.log('TokenRedirect: Verifying token with backend');
          const response = await axios.get(`${config.API_URL}/api/auth/verify-token`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          console.log('TokenRedirect: Token verified successfully', response.data);
          
          // Get the complete user info from the response
          const userInfo = response.data;
          
          // Store the complete user info in localStorage
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          console.log('TokenRedirect: Complete user info stored in localStorage');
          
          // Update Redux state
          dispatch(googleLoginSuccess(userInfo));
          console.log('TokenRedirect: Redux state updated with verified user data');
          
          // Redirect to home page
          setTimeout(() => {
            console.log('TokenRedirect: Redirecting to homepage');
            navigate('/');
          }, 1500);
          
        } catch (apiError) {
          console.error('TokenRedirect: Error verifying token with backend:', apiError);
          setError('Error verifying your login. Please try again.');
          localStorage.removeItem('userInfo'); // Clean up invalid token
          setLoading(false);
        }
      } catch (error) {
        console.error('TokenRedirect: Error processing token:', error);
        setError('An unexpected error occurred. Please try logging in again.');
        setLoading(false);
      }
    };
    
    processTokenAndRedirect();
  }, [navigate, dispatch]);
  
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
      {loading ? (
        <>
          <Spinner animation="border" role="status" style={{ width: '3rem', height: '3rem' }} />
          <h3 className="mt-3">Completing login...</h3>
          <Alert variant="info" className="mt-3">
            Please wait while we complete your Google login. You will be redirected automatically.
          </Alert>
        </>
      ) : (
        <>
          <h3 className="mt-3">Login Error</h3>
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
          <button 
            className="btn btn-primary mt-3" 
            onClick={() => navigate('/login')}
          >
            Return to Login
          </button>
        </>
      )}
    </Container>
  );
};

export default TokenRedirect;
