import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const OAuthDebugger = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [urlInfo, setUrlInfo] = useState({});
  
  // Add a log entry with timestamp
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toISOString();
    setLogs(prevLogs => [...prevLogs, { timestamp, message, type }]);
    console.log(`[${timestamp}] ${message}`);
  };

  useEffect(() => {
    // Log page load
    addLog('OAuth Debugger page loaded', 'info');
    
    // Capture URL information
    const url = window.location.href;
    const pathname = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;
    
    setUrlInfo({ url, pathname, search, hash });
    
    addLog(`Current URL: ${url}`, 'info');
    addLog(`Pathname: ${pathname}`, 'info');
    addLog(`Search params: ${search || 'none'}`, 'info');
    addLog(`Hash fragment: ${hash || 'none'}`, 'info');
    
    // Check localStorage for userInfo
    try {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedUserInfo);
        
        // Log user info details (safely)
        addLog('User info found in localStorage', 'success');
        addLog(`User authenticated: ${parsedUserInfo.isAuthenticated}`, 'info');
        addLog(`Auth source: ${parsedUserInfo.source || 'unknown'}`, 'info');
        addLog(`Login time: ${parsedUserInfo.loginTime || 'unknown'}`, 'info');
        
        if (parsedUserInfo.token) {
          const tokenPreview = `${parsedUserInfo.token.substring(0, 10)}...${parsedUserInfo.token.substring(parsedUserInfo.token.length - 5)}`;
          addLog(`Token: ${tokenPreview} (${parsedUserInfo.token.length} chars)`, 'info');
          
          // Try to parse the JWT token
          try {
            const tokenParts = parsedUserInfo.token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              addLog('Successfully parsed JWT payload', 'success');
              addLog(`User ID: ${payload.id || 'unknown'}`, 'info');
              addLog(`Token issued at: ${new Date(payload.iat * 1000).toLocaleString()}`, 'info');
              addLog(`Token expires at: ${new Date(payload.exp * 1000).toLocaleString()}`, 'info');
            } else {
              addLog('Token does not appear to be a valid JWT (should have 3 parts)', 'warning');
            }
          } catch (e) {
            addLog(`Error parsing JWT: ${e.message}`, 'error');
          }
        } else {
          addLog('No token found in userInfo', 'warning');
        }
      } else {
        addLog('No user info found in localStorage', 'warning');
      }
    } catch (e) {
      addLog(`Error checking localStorage: ${e.message}`, 'error');
    }
    
    // Check for token in URL hash
    if (hash && hash.includes('token=')) {
      addLog('Token found in URL hash', 'info');
      
      try {
        const hashContent = hash.substring(1); // Remove the # character
        const params = new URLSearchParams(hashContent);
        const token = params.get('token');
        const source = params.get('source');
        const time = params.get('time');
        
        if (token) {
          const tokenPreview = `${token.substring(0, 10)}...${token.substring(token.length - 5)}`;
          addLog(`URL token: ${tokenPreview} (${token.length} chars)`, 'info');
          addLog(`URL source: ${source || 'unknown'}`, 'info');
          addLog(`URL time: ${time ? new Date(parseInt(time)).toLocaleString() : 'unknown'}`, 'info');
          
          // Try to parse the JWT token from URL
          try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              addLog('Successfully parsed JWT payload from URL', 'success');
              addLog(`User ID: ${payload.id || 'unknown'}`, 'info');
              addLog(`Token issued at: ${new Date(payload.iat * 1000).toLocaleString()}`, 'info');
              addLog(`Token expires at: ${new Date(payload.exp * 1000).toLocaleString()}`, 'info');
            } else {
              addLog('URL token does not appear to be a valid JWT (should have 3 parts)', 'warning');
            }
          } catch (e) {
            addLog(`Error parsing JWT from URL: ${e.message}`, 'error');
          }
        } else {
          addLog('No token parameter found in hash', 'warning');
        }
      } catch (e) {
        addLog(`Error parsing URL hash: ${e.message}`, 'error');
      }
    }
    
    // Check browser console access
    try {
      console.log('Console logging is working');
      addLog('Console logging is working', 'success');
    } catch (e) {
      addLog(`Console logging error: ${e.message}`, 'error');
    }
    
    // Check if running in production or development
    addLog(`Environment: ${process.env.NODE_ENV}`, 'info');
    
  }, []);
  
  // Function to manually store token from URL
  const handleManualTokenStorage = () => {
    try {
      addLog('Attempting manual token storage from URL hash...', 'info');
      
      if (!window.location.hash) {
        addLog('No hash fragment found in URL', 'error');
        return;
      }
      
      const hashContent = window.location.hash.substring(1);
      const params = new URLSearchParams(hashContent);
      const token = params.get('token');
      
      if (!token) {
        addLog('No token parameter found in hash', 'error');
        return;
      }
      
      // Create user info object
      const userInfoData = {
        token,
        isAuthenticated: true,
        loginTime: new Date().toISOString(),
        source: 'google_oauth_manual'
      };
      
      // Store in localStorage
      localStorage.setItem('userInfo', JSON.stringify(userInfoData));
      
      // Verify storage
      const storedInfo = localStorage.getItem('userInfo');
      if (storedInfo) {
        addLog('Successfully stored token in localStorage', 'success');
        setUserInfo(JSON.parse(storedInfo));
      } else {
        addLog('Failed to verify token storage', 'error');
      }
    } catch (e) {
      addLog(`Error in manual token storage: ${e.message}`, 'error');
    }
  };
  
  // Function to clear localStorage
  const handleClearStorage = () => {
    try {
      localStorage.removeItem('userInfo');
      addLog('Cleared userInfo from localStorage', 'info');
      setUserInfo(null);
    } catch (e) {
      addLog(`Error clearing localStorage: ${e.message}`, 'error');
    }
  };
  
  // Function to navigate to homepage
  const handleNavigateHome = () => {
    navigate('/');
  };
  
  // Function to navigate to login page
  const handleNavigateLogin = () => {
    navigate('/login');
  };
  
  // Function to copy debug info to clipboard
  const handleCopyDebugInfo = () => {
    try {
      const debugInfo = {
        logs,
        userInfo: userInfo ? {
          ...userInfo,
          token: userInfo.token ? `${userInfo.token.substring(0, 10)}...${userInfo.token.substring(userInfo.token.length - 5)} (${userInfo.token.length} chars)` : null
        } : null,
        urlInfo,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };
      
      const debugText = JSON.stringify(debugInfo, null, 2);
      navigator.clipboard.writeText(debugText);
      addLog('Debug info copied to clipboard', 'success');
    } catch (e) {
      addLog(`Error copying debug info: ${e.message}`, 'error');
    }
  };
  
  return (
    <Container className="py-4">
      <h1 className="mb-4">OAuth Debugger</h1>
      
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Actions</h5>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-wrap gap-2">
            <Button variant="primary" onClick={handleManualTokenStorage}>
              Manually Store Token from URL
            </Button>
            <Button variant="warning" onClick={handleClearStorage}>
              Clear localStorage
            </Button>
            <Button variant="success" onClick={handleNavigateHome}>
              Go to Homepage
            </Button>
            <Button variant="secondary" onClick={handleNavigateLogin}>
              Go to Login
            </Button>
            <Button variant="info" onClick={handleCopyDebugInfo}>
              Copy Debug Info
            </Button>
          </div>
        </Card.Body>
      </Card>
      
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">URL Information</h5>
        </Card.Header>
        <Card.Body>
          <p><strong>Full URL:</strong> {urlInfo.url}</p>
          <p><strong>Pathname:</strong> {urlInfo.pathname}</p>
          <p><strong>Search:</strong> {urlInfo.search || 'none'}</p>
          <p><strong>Hash:</strong> {urlInfo.hash || 'none'}</p>
        </Card.Body>
      </Card>
      
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">User Information</h5>
        </Card.Header>
        <Card.Body>
          {userInfo ? (
            <div>
              <p><strong>Authentication Status:</strong> {userInfo.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
              <p><strong>Auth Source:</strong> {userInfo.source || 'Unknown'}</p>
              <p><strong>Login Time:</strong> {userInfo.loginTime || 'Unknown'}</p>
              <p><strong>Token:</strong> {userInfo.token ? 
                `${userInfo.token.substring(0, 10)}...${userInfo.token.substring(userInfo.token.length - 5)} (${userInfo.token.length} chars)` : 
                'No token'}</p>
            </div>
          ) : (
            <Alert variant="warning">No user information found in localStorage</Alert>
          )}
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Debug Logs</h5>
          <span className="badge bg-secondary">{logs.length} entries</span>
        </Card.Header>
        <Card.Body style={{ maxHeight: '400px', overflow: 'auto' }}>
          {logs.map((log, index) => (
            <div key={index} className={`mb-2 p-2 rounded ${
              log.type === 'error' ? 'bg-danger text-white' :
              log.type === 'warning' ? 'bg-warning' :
              log.type === 'success' ? 'bg-success text-white' :
              'bg-light'
            }`}>
              <small className="d-block text-muted">{new Date(log.timestamp).toLocaleTimeString()}</small>
              <span>{log.message}</span>
            </div>
          ))}
          {logs.length === 0 && <p className="text-muted">No logs yet</p>}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OAuthDebugger;
