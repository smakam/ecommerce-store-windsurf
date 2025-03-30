import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Meta from '../components/ui/Meta';

const UserEditScreen = () => {
  return (
    <Container>
      <Meta title="Edit User" />
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="text-center my-4">Edit User</h1>
          <p className="text-center">This is a placeholder for the User Edit screen.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default UserEditScreen;
