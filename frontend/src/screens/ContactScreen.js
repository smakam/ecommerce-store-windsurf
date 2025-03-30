import React, { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import FormContainer from '../components/ui/FormContainer';
import Message from '../components/ui/Message';
import Loader from '../components/ui/Loader';
import Meta from '../components/ui/Meta';

const ContactScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1500);
  };

  return (
    <>
      <Meta title="ShopHub | Contact Us" />
      <h1 className="text-center mb-4">Contact Us</h1>
      <Row className="mb-5">
        <Col md={4}>
          <Card className="h-100 contact-card">
            <Card.Body className="text-center py-4">
              <div className="icon-container mb-3">
                <FaPhone className="contact-icon" />
              </div>
              <Card.Title>Phone</Card.Title>
              <Card.Text>
                <a href="tel:+1234567890" className="contact-link">+1 (234) 567-890</a>
              </Card.Text>
              <Card.Text className="text-muted">
                Monday to Friday, 9am to 6pm
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 contact-card">
            <Card.Body className="text-center py-4">
              <div className="icon-container mb-3">
                <FaEnvelope className="contact-icon" />
              </div>
              <Card.Title>Email</Card.Title>
              <Card.Text>
                <a href="mailto:support@shophub.com" className="contact-link">support@shophub.com</a>
              </Card.Text>
              <Card.Text className="text-muted">
                We'll respond as soon as possible
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 contact-card">
            <Card.Body className="text-center py-4">
              <div className="icon-container mb-3">
                <FaMapMarkerAlt className="contact-icon" />
              </div>
              <Card.Title>Address</Card.Title>
              <Card.Text>
                123 E-Commerce Street
              </Card.Text>
              <Card.Text className="text-muted">
                Silicon Valley, CA 94024
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={6}>
          <h2 className="mb-4">Send Us a Message</h2>
          {error && <Message variant="danger">{error}</Message>}
          {success && (
            <Message variant="success">
              Your message has been sent successfully! We'll get back to you soon.
            </Message>
          )}
          {loading ? (
            <Loader />
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name" className="mb-3">
                <Form.Label>Your Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="subject" className="mb-3">
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="message" className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Enter your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100">
                Send Message
              </Button>
            </Form>
          )}
        </Col>
        <Col md={6}>
          <h2 className="mb-4">Find Us</h2>
          <div className="map-container">
            {/* Placeholder for a map - in a real app, you would integrate Google Maps or similar */}
            <div 
              className="embed-responsive embed-responsive-16by9"
              style={{ 
                height: '400px', 
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #ddd'
              }}
            >
              <div className="text-center">
                <FaMapMarkerAlt size={40} className="text-danger mb-3" />
                <h4>Map Placeholder</h4>
                <p>In a real application, a Google Maps integration would be here</p>
              </div>
            </div>
          </div>
          
          <div className="social-links mt-4">
            <h4>Connect With Us</h4>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="social-icon">
                <FaFacebook size={30} />
              </a>
              <a href="#" className="social-icon">
                <FaTwitter size={30} />
              </a>
              <a href="#" className="social-icon">
                <FaInstagram size={30} />
              </a>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ContactScreen;
