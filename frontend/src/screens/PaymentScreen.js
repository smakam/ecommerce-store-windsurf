import React, { useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/ui/FormContainer';
import CheckoutSteps from '../components/checkout/CheckoutSteps';
import { savePaymentMethod } from '../redux/slices/cartSlice';
import Meta from '../components/ui/Meta';

const PaymentScreen = () => {
  const { shippingAddress } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!shippingAddress.address) {
    navigate('/shipping');
  }

  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <Meta title="ShopHub | Payment Method" />
      <CheckoutSteps step1 step2 step3 />
      <h1 className="mb-4">Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              label="Razorpay (Credit/Debit Card, UPI, Netbanking)"
              id="razorpay"
              name="paymentMethod"
              value="razorpay"
              checked={paymentMethod === 'razorpay'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mb-3"
            ></Form.Check>
            <Form.Check
              type="radio"
              label="Cash on Delivery"
              id="cod"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mb-3"
            ></Form.Check>
          </Col>
        </Form.Group>

        <div className="d-grid gap-2">
          <Button type="submit" variant="primary" className="mt-3">
            Continue
          </Button>
        </div>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
