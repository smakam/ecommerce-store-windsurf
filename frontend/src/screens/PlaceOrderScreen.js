import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/ui/Message';
import CheckoutSteps from '../components/checkout/CheckoutSteps';
import { createOrder, clearError, resetOrderState } from '../redux/slices/orderSlice';
import { resetCart } from '../redux/slices/cartSlice';
import Loader from '../components/ui/Loader';
import Meta from '../components/ui/Meta';

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartState = useSelector((state) => state.cart);
  const { order, success, error, loading } = useSelector((state) => state.order);

  // Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  // Create a local copy of cart data for calculations
  const cart = {
    ...cartState,
    cartItems: [...cartState.cartItems],
    shippingAddress: {...cartState.shippingAddress}
  };
  
  // Calculate prices
  const itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );
  const shippingPrice = addDecimals(Number(itemsPrice) > 500 ? 0 : 50);
  const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  useEffect(() => {
    if (success && order) {
      // Only clear the cart for COD orders
      // For Razorpay, we'll clear the cart after payment is confirmed
      if (cart.paymentMethod === 'cod') {
        dispatch(resetCart());
      }
      navigate(`/order/${order._id}`);
    }
  }, [success, navigate, order, dispatch, cart.paymentMethod]);

  const placeOrderHandler = () => {
    // Reset the order state before creating a new order
    dispatch(resetOrderState());
    
    // For Razorpay, we'll create the order but not clear the cart until payment is confirmed
    // For COD, we'll create the order and clear the cart immediately
    const orderData = {
      orderItems: cart.cartItems,
      shippingAddress: cart.shippingAddress,
      paymentMethod: cart.paymentMethod,
      itemsPrice: itemsPrice,
      shippingPrice: shippingPrice,
      taxPrice: taxPrice,
      totalPrice: totalPrice,
    };
    
    dispatch(createOrder(orderData));
  };

  return (
    <>
      <Meta title="ShopHub | Place Order" />
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong>
                {cart.shippingAddress.name}
              </p>
              <p>
                <strong>Phone: </strong>
                {cart.shippingAddress.phone}
              </p>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.state}, {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row className="align-items-center">
                        <Col md={2}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4} className="text-end">
                          {item.quantity} x ${item.price} = ${(item.quantity * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {error && (
                <ListGroup.Item>
                  <Message variant="danger">{error}</Message>
                </ListGroup.Item>
              )}
              <ListGroup.Item>
                <div className="d-grid gap-2">
                  <Button
                    type="button"
                    className="btn-block"
                    disabled={cart.cartItems.length === 0 || loading}
                    onClick={placeOrderHandler}
                  >
                    {loading ? <Loader /> : 'Place Order'}
                  </Button>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
