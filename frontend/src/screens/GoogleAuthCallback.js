import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { googleLoginSuccess } from '../redux/slices/authSlice';

const GoogleAuthCallback = () => {
  console.log('GoogleAuthCallback component rendering');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get auth state from Redux
  const { userInfo, loading: authLoading, error: authError } = useSelector((state) => state.auth);
  
  // Log component lifecycle
  useEffect(() => {
    console.log('GoogleAuthCallback component mounted');
    return () => {
      console.log('GoogleAuthCallback component unmounting');
    };
  }, []);
  
  useEffect(() => {
    console.log('GoogleAuthCallback: First useEffect triggered');
    console.log('Location search:', location.search);
    
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const errorParam = params.get('error');
    
    console.log('Token from URL:', token ? `${token.substring(0, 20)}...` : 'No token');
    console.log('Error from URL:', errorParam);
    
    if (errorParam) {
      console.error('Google authentication error parameter detected:', errorParam);
      setError('Google authentication failed. Please try again.');
      setLoading(false);
      toast.error('Google authentication failed. Please try again.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    
    if (!token) {
      console.error('No token received in callback URL');
      setError('Authentication failed. No token received.');
      setLoading(false);
      toast.error('Authentication failed. No token received.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    
    // Validate the token format
    if (!token.includes('.') || token.split('.').length !== 3) {
      console.error('Invalid token format received');
      setError('Invalid authentication token received. Please try again.');
      setLoading(false);
      toast.error('Invalid authentication token received');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    
    // Log token details for debugging
    try {
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      console.log('Token payload:', { id: payload.id, iat: payload.iat, exp: payload.exp });
      console.log('Token expiration:', new Date(payload.exp * 1000).toLocaleString());
    } catch (e) {
      console.error('Error parsing token payload:', e);
    }
    
    // Store the token directly in localStorage
    console.log('Storing token in localStorage');
    const userInfoData = { 
      token, 
      isAuthenticated: true,
      loginTime: new Date().toISOString(),
      source: 'google_oauth'
    };
    
    console.log('User info to be stored:', { 
      ...userInfoData, 
      token: userInfoData.token ? `${userInfoData.token.substring(0, 20)}...` : 'none' 
    });
    
    localStorage.setItem('userInfo', JSON.stringify(userInfoData));
    
    // Verify the token was stored correctly
    const storedUserInfo = localStorage.getItem('userInfo');
    console.log('Verification - userInfo in localStorage:', storedUserInfo ? 'exists' : 'does not exist');
    
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        console.log('Verification - parsed userInfo:', { 
          ...parsedUserInfo, 
          token: parsedUserInfo.token ? `${parsedUserInfo.token.substring(0, 20)}...` : 'none' 
        });
      } catch (error) {
        console.error('Error parsing stored userInfo:', error);
      }
    }
    
    // Dispatch the action to store the token in Redux
    console.log('Dispatching googleLoginSuccess with token');
    dispatch(googleLoginSuccess(token))
      .unwrap()
      .then(() => {
        console.log('Successfully stored token in Redux');
      })
      .catch(error => {
        console.error('Error storing token in Redux:', error);
        // Even if Redux fails, we still have the token in localStorage
      });
    
    // Set loading to false since we've stored the token
    setLoading(false);
    toast.success('Successfully logged in with Google!');
    
    // Add a delay before navigating to ensure token is properly processed
    console.log('Waiting before navigation to ensure token is properly processed');
    setTimeout(() => {
      console.log('Now navigating to home page');
      navigate('/');
    }, 1500);
  }, [dispatch, navigate, location]);
  
  // Watch for changes in auth state
  useEffect(() => {
    // Only handle auth state changes from Redux if we didn't already process the token from URL
    // This prevents double navigation and race conditions
    const tokenFromUrl = new URLSearchParams(location.search).get('token');
    
    if (!tokenFromUrl && !authLoading && userInfo) {
      // Successfully logged in through Redux state change
      console.log('Auth state changed in Redux - user logged in');
      setLoading(false);
      toast.success('Successfully logged in with Google!');
      setTimeout(() => navigate('/'), 1000);
    } else if (!tokenFromUrl && !authLoading && authError) {
      // Error occurred during login through Redux state change
      console.log('Auth state changed in Redux - error occurred');
      setLoading(false);
      setError(authError);
      toast.error(authError || 'Authentication failed. Please try again.');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [authLoading, userInfo, authError, navigate]);
  
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="text-center">
        {loading ? (
          <>
            <Spinner animation="border" role="status" variant="primary" />
            <p className="mt-3">Processing your Google login...</p>
          </>
        ) : error ? (
          <Alert variant="danger">
            {error}
            <p className="mt-2">Redirecting to login page...</p>
          </Alert>
        ) : (
          <Alert variant="success">
            Login successful! Redirecting to homepage...
          </Alert>
        )}
      </div>
    </Container>
  );
};

export default GoogleAuthCallback;
