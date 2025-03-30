import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import Message from '../components/ui/Message';
import Loader from '../components/ui/Loader';
import { getWishlist, removeFromWishlist } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import Meta from '../components/ui/Meta';

const WishlistScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { wishlist, loading, error } = useSelector((state) => state.product);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      dispatch(getWishlist());
    }
  }, [dispatch, navigate, userInfo]);

  const removeFromWishlistHandler = (id) => {
    dispatch(removeFromWishlist(id));
  };

  const addToCartHandler = (id) => {
    dispatch(addToCart({ id, quantity: 1 }));
    navigate('/cart');
  };

  return (
    <Row>
      <Meta title="ShopHub | My Wishlist" />
      <Col md={8}>
        <h1 className="mb-4">My Wishlist</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : wishlist && wishlist.length === 0 ? (
          <Message>
            Your wishlist is empty <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {wishlist && wishlist.map((item) => (
              <ListGroup.Item key={item._id} className="wishlist-item">
                <Row className="align-items-center">
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={4}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price.toFixed(2)}</Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="primary"
                      disabled={item.countInStock === 0}
                      onClick={() => addToCartHandler(item._id)}
                    >
                      <FaShoppingCart className="me-2" /> Add to Cart
                    </Button>
                  </Col>
                  <Col md={2} className="text-end">
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromWishlistHandler(item._id)}
                    >
                      <FaTrash className="text-danger" />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <Card.Body>
            <Card.Title>Wishlist Summary</Card.Title>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>
                  {wishlist ? wishlist.length : 0} {wishlist && wishlist.length === 1 ? 'Item' : 'Items'}
                </h2>
              </ListGroup.Item>
              {wishlist && wishlist.length > 0 && (
                <ListGroup.Item>
                  <div className="d-grid gap-2">
                    <Button
                      type="button"
                      variant="outline-primary"
                      onClick={() => navigate('/')}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card.Body>
        </Card>
        {wishlist && wishlist.length > 0 && (
          <Card className="mt-3">
            <Card.Body>
              <Card.Title>Recently Added</Card.Title>
              <ListGroup variant="flush">
                {wishlist.slice(0, 3).map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        )}
      </Col>
    </Row>
  );
};

export default WishlistScreen;
