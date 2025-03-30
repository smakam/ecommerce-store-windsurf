import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import { FaHome, FaSearch } from 'react-icons/fa';
import Meta from '../components/ui/Meta';

const NotFoundScreen = () => {
  return (
    <Row className="justify-content-center text-center py-5">
      <Meta title="ShopHub | Page Not Found" />
      <Col md={6}>
        <div className="not-found-container">
          <h1 className="display-1 fw-bold text-danger">404</h1>
          <h2 className="mb-4">Oops! Page Not Found</h2>
          <p className="lead mb-5">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/">
              <Button variant="primary" size="lg">
                <FaHome className="me-2" /> Go to Homepage
              </Button>
            </Link>
            <Link to="/search">
              <Button variant="outline-primary" size="lg">
                <FaSearch className="me-2" /> Search Products
              </Button>
            </Link>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default NotFoundScreen;
