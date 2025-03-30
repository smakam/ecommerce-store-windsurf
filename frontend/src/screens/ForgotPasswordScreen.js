import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/ui/Message';
import Loader from '../components/ui/Loader';
import FormContainer from '../components/ui/FormContainer';
import { forgotPassword, clearError } from '../redux/slices/authSlice';
import Meta from '../components/ui/Meta';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector((state) => state.auth);

  useEffect(() => {
    if (success) {
      setMessage('Password reset instructions have been sent to your email.');
    }
  }, [success]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }));
  };

  return (
    <FormContainer>
      <Meta title="ShopHub | Forgot Password" />
      <h1 className="text-center mb-4">Forgot Password</h1>
      {message && <Message variant="info">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <div className="d-grid gap-2">
          <Button type="submit" variant="primary" className="mt-3" disabled={loading}>
            Send Reset Link
          </Button>
        </div>
      </Form>

      <Row className="py-3">
        <Col className="text-center">
          Remembered your password?{' '}
          <Link to="/login">
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default ForgotPasswordScreen;
