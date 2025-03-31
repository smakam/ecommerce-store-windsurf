import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { googleLoginSuccess } from '../redux/slices/authSlice';

const TokenHandler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    // Function to extract token from URL fragment
    const handleToken = async () => {
      try {
        // Add visible feedback
        console.log('TokenHandler: Processing URL fragment');
        setDebugInfo(prev => ({ ...prev, step: 'Processing URL fragment' }));
        
        // Log the current URL and hash
        const currentUrl = window.location.href;
        const urlHash = window.location.hash;
        console.log('Current URL:', currentUrl);
        console.log('URL hash:', urlHash);
        setDebugInfo(prev => ({ 
          ...prev, 
          currentUrl,
          urlHash
        }));
        
        // If no hash is present, show an error
        if (!urlHash || urlHash === '#') {
          const errorMsg = 'No URL fragment found in the callback URL';
          console.error(errorMsg);
          setError(errorMsg);
          setLoading(false);
          toast.error('Authentication failed: No token received');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }
        
        // Get token from URL fragment
        const hash = urlHash.substring(1); // Remove the # character
        console.log('Hash without # character:', hash);
        setDebugInfo(prev => ({ ...prev, hash }));
        
        // Parse the hash as URL parameters
        const params = new URLSearchParams(hash);
        const paramEntries = Array.from(params.entries());
        console.log('Params from hash:', paramEntries);
        setDebugInfo(prev => ({ ...prev, params: paramEntries }));
        
        // Extract the token
        const token = params.get('token');
        const tokenPreview = token ? `${token.substring(0, 10)}...${token.substring(token.length - 5)}` : 'missing';
        console.log('Token from URL fragment:', tokenPreview);
        setDebugInfo(prev => ({ ...prev, tokenPreview }));
        
        if (!token) {
          const errorMsg = 'No token found in URL fragment';
          console.error(errorMsg);
          setError(errorMsg);
          setLoading(false);
          toast.error('Authentication failed: No token received');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }
        
        // Validate token format (should be a JWT with 3 parts separated by dots)
        if (!token.includes('.') || token.split('.').length !== 3) {
          const errorMsg = 'Invalid token format received';
          console.error(errorMsg);
          setError(errorMsg);
          setLoading(false);
          toast.error('Authentication failed: Invalid token format');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }
        
        // Store user info in localStorage first
        console.log('Storing token in localStorage');
        setDebugInfo(prev => ({ ...prev, step: 'Storing token in localStorage' }));
        
        const userInfoData = { 
          token, 
          isAuthenticated: true,
          loginTime: new Date().toISOString(),
          source: 'google_oauth'
        };
        
        localStorage.setItem('userInfo', JSON.stringify(userInfoData));
        
        // Verify it was stored correctly
        const storedInfo = localStorage.getItem('userInfo');
        const storedExists = storedInfo ? 'exists' : 'missing';
        console.log('Retrieved from localStorage:', storedExists);
        setDebugInfo(prev => ({ ...prev, storedInfo: storedExists }));
        
        if (!storedInfo) {
          const errorMsg = 'Failed to store user info in localStorage';
          console.error(errorMsg);
          setError(errorMsg);
          setLoading(false);
          toast.error('Authentication failed: Could not store user data');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }
        
        // Now dispatch the Redux action
        console.log('Dispatching googleLoginSuccess action with token');
        setDebugInfo(prev => ({ ...prev, step: 'Dispatching Redux action' }));
        
        try {
          // Dispatch the Redux action to update the auth state
          await dispatch(googleLoginSuccess(token)).unwrap();
          console.log('googleLoginSuccess action succeeded');
          setDebugInfo(prev => ({ ...prev, reduxAction: 'succeeded' }));
          
          // Show success message
          toast.success('Successfully logged in with Google!');
          
          // Redirect to home page after a short delay
          console.log('Login successful, redirecting to homepage');
          setDebugInfo(prev => ({ ...prev, step: 'Redirecting to homepage' }));
          
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } catch (dispatchError) {
          console.error('Error dispatching googleLoginSuccess:', dispatchError);
          setDebugInfo(prev => ({ 
            ...prev, 
            reduxAction: 'failed',
            reduxError: dispatchError?.message || 'Unknown dispatch error'
          }));
          
          // Even if Redux fails, we still have the token in localStorage, so we can try to continue
          console.log('Continuing with localStorage token despite Redux error');
          toast.warning('Partial login success. Some features may be limited.');
          
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      } catch (error) {
        // Handle any unexpected errors
        console.error('Error processing token:', error);
        setError(error.message || 'Unknown error processing authentication token');
        setLoading(false);
        setDebugInfo(prev => ({ 
          ...prev, 
          error: error.message || 'Unknown error',
          stack: error.stack
        }));
        
        toast.error('Authentication failed: An unexpected error occurred');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    // Run the token handler
    handleToken();
  }, [navigate, dispatch]);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="text-center">
        <h2>Finalizing Login</h2>
        
        {loading ? (
          <>
            <p>Please wait while we complete your login...</p>
            <Spinner animation="border" variant="primary" />
            <div className="mt-3">
              <small className="text-muted">
                If you're not redirected within 10 seconds, <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>click here</a>
              </small>
            </div>
          </>
        ) : error ? (
          <>
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
            <div className="mt-3">
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/login')}
              >
                Return to Login
              </button>
            </div>
          </>
        ) : null}
        
        {/* Debug information (only visible in development) */}
        {process.env.NODE_ENV === 'development' && Object.keys(debugInfo).length > 0 && (
          <div className="mt-4 text-start">
            <h5>Debug Information</h5>
            <pre className="bg-light p-3" style={{ fontSize: '0.8rem', overflowX: 'auto' }}>
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Container>
  );
};

export default TokenHandler;
