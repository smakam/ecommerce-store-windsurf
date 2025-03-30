import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Meta from '../components/ui/Meta';

const ProductListScreen = () => {
  return (
    <Container>
      <Meta title="Product List" />
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="text-center my-4">Product List</h1>
          <p className="text-center">This is a placeholder for the Product List screen.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductListScreen;
