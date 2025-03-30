import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Meta from '../components/ui/Meta';

const AdminDashboardScreen = () => {
  return (
    <Container>
      <Meta title="Admin Dashboard" />
      <h1 className="text-center my-4">Admin Dashboard</h1>
      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Users</Card.Title>
              <Card.Text>
                Manage user accounts and permissions
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Products</Card.Title>
              <Card.Text>
                Manage product inventory and details
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Orders</Card.Title>
              <Card.Text>
                View and manage customer orders
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboardScreen;
