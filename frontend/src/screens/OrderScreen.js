import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../components/ui/Message";
import Loader from "../components/ui/Loader";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
  cancelOrder,
  resetOrderState,
} from "../redux/slices/orderSlice";
import { resetCart } from "../redux/slices/cartSlice";
import Meta from "../components/ui/Meta";

const OrderScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const { order, loading, error } = useSelector((state) => state.order);
  const { userInfo } = useSelector((state) => state.auth);
  
  // Log environment variables for debugging
  useEffect(() => {
    console.log('Environment variables:', {
      REACT_APP_RAZORPAY_KEY_ID: process.env.REACT_APP_RAZORPAY_KEY_ID,
      NODE_ENV: process.env.NODE_ENV
    });
  }, []);

  useEffect(() => {
    if (!order || order._id !== id) {
      dispatch(getOrderDetails(id));
    }

    // Load Razorpay script
    if (
      order &&
      !order.isPaid &&
      order.paymentMethod === "razorpay" &&
      !razorpayLoaded
    ) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      document.body.appendChild(script);
    }
  }, [dispatch, id, order, razorpayLoaded]);

  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded) {
      toast.error("Razorpay is still loading. Please wait a moment.");
      return;
    }

    try {
      // Get the Razorpay key from environment variables or use hardcoded test key
      const razorpayKeyId = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_tHLftLa9DvBJyg';
      
      console.log('Using Razorpay Key:', razorpayKeyId);
      console.log('Order details:', order);
      
      // Check if we have a Razorpay order ID
      let razorpayOrderId;
      
      if (order.paymentResult && order.paymentResult.razorpay_order_id) {
        razorpayOrderId = order.paymentResult.razorpay_order_id;
        console.log('Using existing Razorpay order ID:', razorpayOrderId);
      } else {
        // If no Razorpay order ID exists, create one on demand
        console.log('No Razorpay order ID found, creating one on demand');
        
        try {
          console.log('Making API call to create Razorpay order with data:', {
            amount: order.totalPrice,
            currency: 'INR',
            receipt: `receipt_${order._id}`,
            orderId: order._id,
          });
          
          // Set to false to use actual Razorpay modal
          const useMockPayment = false;
          
          if (useMockPayment) {
            console.log('Using mock payment flow for testing');
            toast.info('Using test mode for payment');
            
            // Simulate successful payment
            dispatch(resetCart());
            
            dispatch(
              payOrder({
                orderId: order._id,
                paymentResult: {
                  id: `pay_${Date.now()}`,
                  status: "completed",
                  update_time: Date.now(),
                  email_address: userInfo.email,
                  razorpay_payment_id: `pay_${Date.now()}`,
                  razorpay_order_id: `order_${Date.now()}`,
                  razorpay_signature: 'test_signature',
                  mock: true
                },
              })
            );
            
            toast.success('Test payment successful!');
            return;
          }
          
          const response = await fetch(`/api/payment/create-order`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
            },
            body: JSON.stringify({
              amount: order.totalPrice,
              currency: 'INR',
              receipt: `receipt_${order._id}`,
              orderId: order._id,
            }),
          });
          
          console.log('Response status:', response.status);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            toast.error(`Failed to create Razorpay order: ${response.status}`);
            
            // For debugging purposes
            console.error('Request details:', {
              url: '/api/payment/create-order',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token.substring(0, 10)}...` // Only show part of the token for security
              },
              body: {
                amount: order.totalPrice,
                currency: 'INR',
                receipt: `receipt_${order._id}`,
                orderId: order._id,
              }
            });
            
            return;
          }
          
          const data = await response.json();
          razorpayOrderId = data.id;
          console.log('Created new Razorpay order ID:', razorpayOrderId);
          
          // Check if this is a mock order for testing
          if (data.mock) {
            console.log('Using mock Razorpay order for testing');
            // For testing, we'll simulate a successful payment
            toast.info('Using test mode for payment');
            
            // Simulate successful payment
            // Clear the cart after successful payment
            dispatch(resetCart());
            
            dispatch(
              payOrder({
                orderId: order._id,
                paymentResult: {
                  id: `pay_${Date.now()}`,
                  status: "completed",
                  update_time: Date.now(),
                  email_address: userInfo.email,
                  razorpay_payment_id: `pay_${Date.now()}`,
                  razorpay_order_id: razorpayOrderId,
                  razorpay_signature: 'test_signature',
                  mock: true
                },
              })
            );
            
            toast.success('Test payment successful!');
            return;
          }
        } catch (error) {
          console.error('Error creating Razorpay order:', error);
          toast.error('Could not initialize payment. Please try again later.');
          return;
        }
      }

      const options = {
        key: razorpayKeyId,
        amount: order.totalPrice * 100, // Razorpay expects amount in paise
        currency: "INR",
        name: "ShopHub",
        description: `Order #${order._id}`,
        order_id: razorpayOrderId,
        handler: function (response) {
          console.log('Razorpay payment successful:', response);
          // Clear the cart after successful payment
          // Clear the cart after successful payment
          dispatch(resetCart());
          
          // Update the order with payment details
          dispatch(
            payOrder({
              orderId: order._id,
              paymentResult: {
                id: response.razorpay_payment_id,
                status: "completed",
                update_time: Date.now(),
                email_address: userInfo.email,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              },
            })
          );
          
          // Show success message
          toast.success('Payment successful! Order has been placed.');
          
          // Reset order state for future orders
          setTimeout(() => {
            dispatch(resetOrderState());
          }, 3000);
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
          }
        }
      };

      console.log('Initializing Razorpay with options:', options);
      
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        toast.error(`Payment failed: ${response.error.description}`);
      });
      
      rzp.open();
    } catch (error) {
      console.error('Error in Razorpay payment:', error);
      toast.error('Payment processing error. Please try again.');
    }
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order._id));
  };

  const cancelHandler = () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      dispatch(cancelOrder(order._id));
    }
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : order ? (
    <>
      <Meta title={`ShopHub | Order ${order._id}`} />
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on{" "}
                  {new Date(order.deliveredAt).toLocaleDateString()}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">
                  Paid on {new Date(order.paidAt).toLocaleDateString()}
                </Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
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
                          {item.quantity} x ${item.price} = $
                          {(item.quantity * item.price).toFixed(2)}
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
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && order.paymentMethod === "razorpay" && (
                <ListGroup.Item>
                  <div className="d-grid gap-2">
                    <Button
                      type="button"
                      className="btn-block"
                      onClick={handleRazorpayPayment}
                      disabled={!razorpayLoaded}
                    >
                      Pay Now
                    </Button>
                  </div>
                </ListGroup.Item>
              )}
              {userInfo &&
                userInfo.role === "admin" &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <div className="d-grid gap-2">
                      <Button
                        type="button"
                        className="btn-block"
                        onClick={deliverHandler}
                      >
                        Mark As Delivered
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              {userInfo &&
                (userInfo._id === order.user._id ||
                  userInfo.role === "admin") &&
                !order.isPaid &&
                !order.isCancelled && (
                  <ListGroup.Item>
                    <div className="d-grid gap-2">
                      <Button
                        type="button"
                        className="btn-block"
                        variant="danger"
                        onClick={cancelHandler}
                      >
                        Cancel Order
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  ) : (
    <Message variant="danger">Order not found</Message>
  );
};

export default OrderScreen;
