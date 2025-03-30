import React, { useEffect, useState } from 'react';
import { Row, Col, Container, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import ProductCarousel from '../components/product/ProductCarousel';
import Loader from '../components/ui/Loader';
import Message from '../components/ui/Message';
import Paginate from '../components/ui/Paginate';
import { getProducts } from '../redux/slices/productSlice';
import Meta from '../components/ui/Meta';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { keyword, pageNumber = 1 } = useParams();
  const [category, setCategory] = useState('');
  const [sortOption, setSortOption] = useState('');

  const { products, loading, error, page, pages } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(getProducts({ keyword, pageNumber, category, sort: sortOption }));
  }, [dispatch, keyword, pageNumber, category, sortOption]);

  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Kitchen',
    'Beauty',
    'Toys',
    'Sports',
    'Automotive',
  ];

  return (
    <>
      <Meta />
      {!keyword && <ProductCarousel />}
      
      <Container>
        <h1 className="text-center mb-4">Latest Products</h1>
        
        <Row className="mb-4">
          <Col md={6} lg={4} className="mb-3 mb-md-0">
            <Form.Group>
              <Form.Label>Filter by Category</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={6} lg={4} className="ms-auto">
            <Form.Group>
              <Form.Label>Sort by</Form.Label>
              <Form.Select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Latest</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-rating">Top Rated</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : products.length === 0 ? (
          <Message>No products found</Message>
        ) : (
          <>
            <Row>
              {products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
            <Paginate
              pages={pages}
              page={page}
              keyword={keyword ? keyword : ''}
            />
          </>
        )}
      </Container>
    </>
  );
};

export default HomeScreen;
