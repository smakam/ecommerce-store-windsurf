import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Meta from '../components/ui/Meta';

const ProductEditScreen = () => {
  return (
    <Container>
      <Meta title="Edit Product" />
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="text-center my-4">Edit Product</h1>
          <p className="text-center">This is a placeholder for the Product Edit screen.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductEditScreen;
