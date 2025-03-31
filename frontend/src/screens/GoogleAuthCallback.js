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
    
    // Store the token directly in localStorage as a backup
    console.log('Storing token in localStorage as backup');
    localStorage.setItem('userInfo', JSON.stringify({ token, isAuthenticated: true }));
    
    // Dispatch the action to store the token in Redux
    console.log('Dispatching googleLoginSuccess with token');
    dispatch(googleLoginSuccess(token))
      .unwrap()
      .then(() => {
        console.log('Successfully stored token in Redux');
        // No need to make an additional API call here since we've already stored the token
      })
      .catch(error => {
        console.error('Error storing token in Redux:', error);
        // Even if Redux fails, we still have the token in localStorage
      });
    
    // Set loading to false since we've stored the token
    setLoading(false);
    toast.success('Successfully logged in with Google!');
    
    // Navigate to home page
    navigate('/');
  }, [dispatch, navigate, location]);
  
  // Watch for changes in auth state
  useEffect(() => {
    if (!authLoading && userInfo) {
      // Successfully logged in
      setLoading(false);
      toast.success('Successfully logged in with Google!');
      navigate('/');
    } else if (!authLoading && authError) {
      // Error occurred during login
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
