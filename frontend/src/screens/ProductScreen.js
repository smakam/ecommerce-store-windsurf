import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import Rating from '../components/product/Rating';
import Loader from '../components/ui/Loader';
import Message from '../components/ui/Message';
import Meta from '../components/ui/Meta';
import { getProductDetails, createProductReview, clearError, clearSuccess } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';

const ProductScreen = () => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [activeImg, setActiveImg] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { loading, error, product, success } = useSelector((state) => state.product);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getProductDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (success) {
      setRating(0);
      setComment('');
      toast.success('Review submitted successfully');
      dispatch(clearSuccess());
      dispatch(getProductDetails(id));
    }
  }, [success, dispatch, id]);

  const addToCartHandler = () => {
    dispatch(addToCart({ id, quantity: qty }));
    navigate('/cart');
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProductReview({
        productId: id,
        review: {
          rating,
          comment,
        },
      })
    );
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : product ? (
        <>
          <Meta title={product.name} description={product.description} />
          <Row>
            <Col md={6}>
              <div className="product-image-gallery mb-3">
                {product.images && product.images.length > 0 && (
                  <Image
                    src={product.images[activeImg]}
                    alt={product.name}
                    fluid
                    className="main-product-image"
                  />
                )}
                {product.images && product.images.length > 1 && (
                  <Row className="mt-2">
                    {product.images.map((img, index) => (
                      <Col key={index} xs={3} className="px-1">
                        <Image
                          src={img}
                          alt={`${product.name}-${index}`}
                          fluid
                          className={`thumbnail-image ${activeImg === index ? 'active' : ''}`}
                          onClick={() => setActiveImg(index)}
                        />
                      </Col>
                    ))}
                  </Row>
                )}
              </div>
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  {product.discountPrice > 0 ? (
                    <>
                      <h4 className="text-danger">${product.discountPrice.toFixed(2)}</h4>
                      <p className="text-muted text-decoration-line-through">
                        ${product.price.toFixed(2)}
                      </p>
                      <p className="text-success">
                        Save ${(product.price - product.discountPrice).toFixed(2)} (
                        {Math.round(((product.price - product.discountPrice) / product.price) * 100)}
                        %)
                      </p>
                    </>
                  ) : (
                    <h4>${product.price.toFixed(2)}</h4>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="product-description">{product.description}</p>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>
                          ${product.discountPrice > 0
                            ? product.discountPrice.toFixed(2)
                            : product.price.toFixed(2)}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {[...Array(Math.min(product.countInStock, 10)).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className="btn-block w-100"
                      type="button"
                      disabled={product.countInStock === 0}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>
                  {error && <Message variant="danger">{error}</Message>}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating" className="mb-3">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment" className="mb-3">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to="/login">sign in</Link> to write a review{' '}
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={6}>
              <Card className="p-3 mb-4">
                <h4>Product Details</h4>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Brand:</strong> {product.brand}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Category:</strong> {product.category}
                  </ListGroup.Item>
                  {product.specifications && product.specifications.length > 0 && (
                    <ListGroup.Item>
                      <strong>Specifications:</strong>
                      <ul className="mt-2">
                        {product.specifications.map((spec, index) => (
                          <li key={index}>
                            <strong>{spec.key}:</strong> {spec.value}
                          </li>
                        ))}
                      </ul>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <Message variant="danger">Product not found</Message>
      )}
    </>
  );
};

export default ProductScreen;
