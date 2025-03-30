import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={3} sm={6} className="mb-4">
            <h5>ShopHub</h5>
            <p className="text-muted">
              Your one-stop destination for all your shopping needs. Quality products, competitive prices, and excellent customer service.
            </p>
            <div className="d-flex social-icons">
              <a href="#" className="me-2 text-light">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="me-2 text-light">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="me-2 text-light">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-light">
                <FaLinkedin size={20} />
              </a>
            </div>
          </Col>
          <Col md={3} sm={6} className="mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-muted text-decoration-none">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/cart" className="text-muted text-decoration-none">Cart</Link>
              </li>
              <li className="mb-2">
                <Link to="/profile" className="text-muted text-decoration-none">My Account</Link>
              </li>
              <li className="mb-2">
                <Link to="/orderhistory" className="text-muted text-decoration-none">Order History</Link>
              </li>
            </ul>
          </Col>
          <Col md={3} sm={6} className="mb-4">
            <h5>Customer Service</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/contact" className="text-muted text-decoration-none">Contact Us</Link>
              </li>
              <li className="mb-2">
                <Link to="/faq" className="text-muted text-decoration-none">FAQ</Link>
              </li>
              <li className="mb-2">
                <Link to="/shipping" className="text-muted text-decoration-none">Shipping Policy</Link>
              </li>
              <li className="mb-2">
                <Link to="/returns" className="text-muted text-decoration-none">Returns & Refunds</Link>
              </li>
            </ul>
          </Col>
          <Col md={3} sm={6} className="mb-4">
            <h5>Newsletter</h5>
            <p className="text-muted">Subscribe to receive updates on new arrivals and special offers</p>
            <div className="input-group mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email Address"
                aria-label="Email Address"
              />
              <button className="btn btn-primary" type="button">
                Subscribe
              </button>
            </div>
          </Col>
        </Row>
        <hr className="my-3 bg-secondary" />
        <Row>
          <Col className="text-center text-muted">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} ShopHub. All Rights Reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
