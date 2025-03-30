import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Meta from '../components/ui/Meta';

const UserListScreen = () => {
  return (
    <Container>
      <Meta title="User List" />
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="text-center my-4">User List</h1>
          <p className="text-center">This is a placeholder for the User List screen.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default UserListScreen;
