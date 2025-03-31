import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Container, Spinner } from 'react-bootstrap';
import { googleLoginSuccess } from '../redux/slices/authSlice';

const TokenHandler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Function to extract token from URL fragment
    const handleToken = () => {
      try {
        console.log('TokenHandler: Processing URL fragment');
        console.log('Current URL:', window.location.href);
        console.log('URL hash:', window.location.hash);
        
        // Get token from URL fragment
        const hash = window.location.hash.substring(1); // Remove the # character
        console.log('Hash without # character:', hash);
        
        const params = new URLSearchParams(hash);
        console.log('Params from hash:', Array.from(params.entries()));
        
        const token = params.get('token');
        console.log('Token from URL fragment:', token ? `${token.substring(0, 10)}...` : 'missing');
        
        if (!token) {
          console.error('No token found in URL fragment');
          navigate('/login');
          return;
        }
        
        console.log('Dispatching googleLoginSuccess action with token');
        try {
          // Dispatch the Redux action to update the auth state
          dispatch(googleLoginSuccess(token))
            .unwrap()
            .then((result) => {
              console.log('googleLoginSuccess action succeeded:', result);
            })
            .catch((error) => {
              console.error('googleLoginSuccess action failed:', error);
            });
        } catch (dispatchError) {
          console.error('Error dispatching googleLoginSuccess:', dispatchError);
        }
        
        // Verify it was stored
        try {
          const storedInfo = localStorage.getItem('userInfo');
          console.log('Retrieved from localStorage:', storedInfo ? 'exists' : 'missing');
          
          if (!storedInfo) {
            throw new Error('Failed to store user info in localStorage');
          }
          
          const parsedInfo = JSON.parse(storedInfo);
          console.log('Parsed userInfo:', {
            token: parsedInfo.token ? `${parsedInfo.token.substring(0, 10)}...` : 'missing',
            isAuthenticated: parsedInfo.isAuthenticated
          });
        } catch (retrieveError) {
          console.error('Error retrieving from localStorage:', retrieveError);
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
