import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { login } from '../redux/slices/authSlice';
import api from '../api/axios';
import config from '../config';

const GoogleAuthCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');
    
    if (error) {
      toast.error('Google authentication failed. Please try again.');
      navigate('/login');
      return;
    }
    
    if (token) {
      // Fetch user info using the token
      const fetchUserInfo = async () => {
        try {
          console.log('Fetching user profile with token');
          console.log('API URL being used:', config.API_URL);
          
          // Create a direct axios instance for this specific request to ensure we have control over everything
          const axios = require('axios');
          
          // Make a direct request to the full URL to avoid any baseURL issues
          const fullUrl = `${config.API_URL}/auth/profile`;
          console.log('Making request to:', fullUrl);
          
          const response = await axios.get(fullUrl, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            timeout: 10000
          });
          
          // Axios returns data directly
          const userData = response.data;
          
          console.log('Successfully fetched user profile');
          console.log('User data:', userData);
          
          // Create complete user info object
          const userInfo = {
            ...userData,
            token,
          };
          
          // Store in localStorage
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          
          // Update Redux state
          dispatch({ type: 'auth/login/fulfilled', payload: userInfo });
          
          // Redirect to home page
          toast.success('Successfully logged in with Google!');
          navigate('/');
        } catch (error) {
          console.error('Error fetching user data:', error);
          
          // More detailed error logging
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            console.error('Error request:', error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
          }
          
          toast.error('Authentication failed. Please try again.');
          navigate('/login');
        }
      };
      
      fetchUserInfo();
    } else {
      toast.error('Authentication failed. No token received.');
      navigate('/login');
    }
  }, [dispatch, navigate, location]);
  
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="text-center">
        <Spinner animation="border" role="status" variant="primary" />
        <p className="mt-3">Processing your Google login...</p>
      </div>
    </Container>
  );
};

export default GoogleAuthCallback;
