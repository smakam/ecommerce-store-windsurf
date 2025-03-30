import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaFilter } from 'react-icons/fa';
import Product from '../components/product/ProductCard';
import Message from '../components/ui/Message';
import Loader from '../components/ui/Loader';
import Paginate from '../components/ui/Paginate';
import { listProducts } from '../redux/slices/productSlice';
import Meta from '../components/ui/Meta';

const CategoryScreen = () => {
  const { category, pageNumber = 1 } = useParams();
  
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState(0);
  const [sortOrder, setSortOrder] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const dispatch = useDispatch();

  const { loading, error, products, page, pages } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(
      listProducts({
        category,
        pageNumber,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        rating: rating || undefined,
        sortOrder: sortOrder || undefined,
      })
    );
  }, [dispatch, category, pageNumber, minPrice, maxPrice, rating, sortOrder]);

  const applyFilters = () => {
    dispatch(
      listProducts({
        category,
        pageNumber: 1,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        rating: rating || undefined,
        sortOrder: sortOrder || undefined,
      })
    );
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setRating(0);
    setSortOrder('');
    dispatch(
      listProducts({
        category,
        pageNumber,
      })
    );
  };

  const formatCategoryName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <>
      <Meta title={`ShopHub | ${formatCategoryName(category)}`} />
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      <h1>{formatCategoryName(category)}</h1>
      
      <Button 
        variant="outline-primary" 
        className="mb-3 d-md-none"
        onClick={() => setShowFilters(!showFilters)}
      >
        <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
      </Button>
      
      <Row>
        <Col md={3} className={`filter-sidebar ${showFilters ? 'd-block' : 'd-none d-md-block'}`}>
          <h4>Filter Products</h4>
          <Form>
            <Form.Group controlId="priceRange" className="mb-3">
              <Form.Label>Price Range</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group controlId="rating" className="mb-3">
              <Form.Label>Minimum Rating</Form.Label>
              <Form.Select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="0">All Ratings</option>
                <option value="4">4★ & Above</option>
                <option value="3">3★ & Above</option>
                <option value="2">2★ & Above</option>
                <option value="1">1★ & Above</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="sortOrder" className="mb-3">
              <Form.Label>Sort By</Form.Label>
              <Form.Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="">Relevance</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Highest Rated</option>
                <option value="newest">Newest Arrivals</option>
              </Form.Select>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" onClick={applyFilters}>
                Apply Filters
              </Button>
              <Button variant="outline-secondary" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </Form>
        </Col>
        <Col md={9}>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <>
              <Row className="mb-3">
                <Col>
                  <h5>{products.length} Results Found</h5>
                </Col>
                <Col className="text-end d-none d-md-block">
                  <Form.Select
                    value={sortOrder}
                    onChange={(e) => {
                      setSortOrder(e.target.value);
                      applyFilters();
                    }}
                    style={{ width: 'auto', float: 'right' }}
                  >
                    <option value="">Sort by: Relevance</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating_desc">Highest Rated</option>
                    <option value="newest">Newest Arrivals</option>
                  </Form.Select>
                </Col>
              </Row>
              
              {products.length === 0 ? (
                <Message>No Products Found in this Category</Message>
              ) : (
                <>
                  <Row>
                    {products.map((product) => (
                      <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                        <Product product={product} />
                      </Col>
                    ))}
                  </Row>
                  <Paginate
                    pages={pages}
                    page={page}
                    category={category}
                  />
                </>
              )}
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

export default CategoryScreen;
