import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { login } from '../redux/slices/authSlice';
import api from '../api/axios';

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
          // Use the axios instance with the correct baseURL instead of fetch
          const response = await api.get('/auth/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          // Axios returns data directly
          const userData = response.data;
          
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
