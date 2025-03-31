import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Alert, Spinner, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const SimpleTokenHandler = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing...');
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const processToken = () => {
      try {
        // Log current URL for debugging
        console.log('Current URL:', window.location.href);
        setDebugInfo(prev => ({ ...prev, url: window.location.href }));
        
        // Get hash fragment (after #)
        const hashFragment = window.location.hash;
        console.log('Hash fragment:', hashFragment);
        setDebugInfo(prev => ({ ...prev, hashFragment }));
        
        if (!hashFragment || hashFragment === '#') {
          setStatus('No token found');
          setError('No authentication token was found in the URL');
          return;
        }
        
        // Remove the # character
        const hashContent = hashFragment.substring(1);
        console.log('Hash content:', hashContent);
        setDebugInfo(prev => ({ ...prev, hashContent }));
        
        // Parse the hash content
        const params = new URLSearchParams(hashContent);
        const extractedToken = params.get('token');
        
        if (!extractedToken) {
          setStatus('Invalid token');
          setError('The authentication token is missing or invalid');
          return;
        }
        
        // Store token in state for display
        setToken(extractedToken);
        console.log('Token found:', extractedToken.substring(0, 15) + '...');
        setDebugInfo(prev => ({ 
          ...prev, 
          tokenPreview: extractedToken.substring(0, 15) + '...',
          tokenLength: extractedToken.length
        }));
        
        // Store in localStorage
        const userInfo = {
          token: extractedToken,
          isAuthenticated: true,
          loginTime: new Date().toISOString(),
          source: 'google_oauth'
        };
        
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        setStatus('Authentication successful');
        
        // Show success message
        toast.success('Successfully logged in with Google!');
        
        // Redirect to home after a delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
        
      } catch (error) {
        console.error('Error processing token:', error);
        setStatus('Error');
        setError(error.message || 'An unexpected error occurred');
        setDebugInfo(prev => ({ ...prev, error: error.message }));
      }
    };
    
    processToken();
  }, [navigate]);
  
  const handleManualRedirect = () => {
    navigate('/');
  };
  
  return (
    <Container className="py-5 text-center">
      <h2>Google Authentication</h2>
      
      {status === 'Processing...' && (
        <div className="my-4">
          <Spinner animation="border" />
          <p className="mt-3">Processing your login...</p>
        </div>
      )}
      
      {status === 'Authentication successful' && (
        <div className="my-4">
          <Alert variant="success">
            Authentication successful! Redirecting you to the homepage...
          </Alert>
          <Button 
            variant="primary" 
            onClick={handleManualRedirect}
            className="mt-3"
          >
            Go to Homepage Now
          </Button>
        </div>
      )}
      
      {error && (
        <div className="my-4">
          <Alert variant="danger">
            {error}
          </Alert>
          <Button 
            variant="primary" 
            onClick={() => navigate('/login')}
            className="mt-3"
          >
            Return to Login
          </Button>
        </div>
      )}
      
      {/* Debug information (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-5 text-start">
          <h5>Debug Information</h5>
          <pre className="bg-light p-3" style={{ fontSize: '0.8rem' }}>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
          
          {token && (
            <div className="mt-3">
              <h6>Token Preview:</h6>
              <div className="bg-light p-2" style={{ wordBreak: 'break-all' }}>
                {token}
              </div>
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

export default SimpleTokenHandler;
