import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Message from '../components/ui/Message';
import Loader from '../components/ui/Loader';
import FormContainer from '../components/ui/FormContainer';
import { resetPassword, clearError } from '../redux/slices/authSlice';
import Meta from '../components/ui/Meta';

const ResetPasswordScreen = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const { loading, error, success } = useSelector((state) => state.auth);

  useEffect(() => {
    if (success) {
      setMessage('Password has been reset successfully');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  }, [success, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else if (password.length < 6) {
      setMessage('Password must be at least 6 characters long');
    } else {
      dispatch(resetPassword({ token, password }));
    }
  };

  return (
    <FormContainer>
      <Meta title="ShopHub | Reset Password" />
      <h1 className="text-center mb-4">Reset Password</h1>
      {message && <Message variant="info">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="password" className="mb-3">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="confirmPassword" className="mb-3">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength="6"
          ></Form.Control>
        </Form.Group>

        <div className="d-grid gap-2">
          <Button type="submit" variant="primary" className="mt-3" disabled={loading}>
            Reset Password
          </Button>
        </div>
      </Form>
    </FormContainer>
  );
};

export default ResetPasswordScreen;
