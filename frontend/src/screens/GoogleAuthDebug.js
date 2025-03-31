import React, { useEffect, useState } from 'react';
import { Container, Card, Alert, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

const GoogleAuthDebug = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [timestamp, setTimestamp] = useState(new Date().toISOString());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔍 GoogleAuthDebug: Component mounted');
    console.log('🔍 Current URL:', window.location.href);
    console.log('🔍 Location object:', location);
    
    // Get URL parameters
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');
    
    // Get localStorage data
    let storedUserInfo = null;
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        storedUserInfo = JSON.parse(userInfoStr);
      }
    } catch (e) {
      console.error('🔍 Error parsing localStorage userInfo:', e);
    }
    
    // Collect debug information
    const info = {
      url: window.location.href,
      pathname: location.pathname,
      search: location.search,
      token: token ? `${token.substring(0, 20)}...` : 'Not present',
      error: error || 'None',
      timestamp: new Date().toISOString(),
      localStorage: storedUserInfo ? {
        ...storedUserInfo,
        token: storedUserInfo.token ? `${storedUserInfo.token.substring(0, 20)}...` : 'None'
      } : 'No userInfo in localStorage',
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'None'
    };
    
    console.log('🔍 Debug information:', info);
    setDebugInfo(info);
    
    // Update timestamp every second
    const interval = setInterval(() => {
      setTimestamp(new Date().toISOString());
    }, 1000);
    
    return () => {
      clearInterval(interval);
      console.log('🔍 GoogleAuthDebug: Component unmounting');
    };
  }, [location]);
  
  const handleContinue = () => {
    // Store token if present
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      console.log('🔍 Storing token from URL before continuing');
      localStorage.setItem('userInfo', JSON.stringify({
        token,
        isAuthenticated: true,
        loginTime: new Date().toISOString(),
        source: 'google_oauth_debug'
      }));
    }
    
    navigate('/');
  };
  
  const handleRetry = () => {
    window.location.href = '/api/auth/google';
  };
  
  return (
    <Container className="py-5">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Google OAuth Debug Page</h4>
        </Card.Header>
        <Card.Body>
          <Alert variant="info">
            <strong>Current time:</strong> {timestamp}
          </Alert>
          
          <h5>Debug Information:</h5>
          <pre className="bg-light p-3 rounded" style={{ maxHeight: '300px', overflow: 'auto' }}>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
          
          <div className="d-flex justify-content-between mt-4">
            <Button variant="secondary" onClick={handleRetry}>
              Retry Google Login
            </Button>
            <Button variant="primary" onClick={handleContinue}>
              Continue to Homepage
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default GoogleAuthDebug;
