import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import Loader from '../components/ui/Loader';
import { verifyEmail } from '../redux/slices/authSlice';
import Meta from '../components/ui/Meta';

const VerifyEmailScreen = () => {
  const dispatch = useDispatch();
  const { token } = useParams();
  
  const { loading, error, success } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token));
    }
  }, [dispatch, token]);

  return (
    <Container>
      <Meta title="Verify Email" />
      <Row className="justify-content-center">
        <Col md={6}>
          <h1 className="text-center my-4">Email Verification</h1>
          {loading ? (
            <Loader />
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : success ? (
            <>
              <Alert variant="success">
                Your email has been successfully verified!
              </Alert>
              <div className="text-center mt-3">
                <Link to="/login" className="btn btn-primary">
                  Proceed to Login
                </Link>
              </div>
            </>
          ) : (
            <Alert variant="info">Verifying your email...</Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default VerifyEmailScreen;
