const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/order.model');

// Initialize Razorpay with error handling
let razorpay;
try {
  console.log('Initializing Razorpay with keys:', {
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET ? '****' : 'undefined',
  });
  
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  
  console.log('Razorpay initialized successfully');
} catch (error) {
  console.error('Failed to initialize Razorpay:', error);
  // We'll handle this in the routes
}

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
exports.createRazorpayOrder = async (req, res) => {
  try {
    // Check if Razorpay is properly initialized
    if (!razorpay) {
      console.error('Razorpay is not initialized');
      return res.status(503).json({ 
        message: 'Payment service unavailable', 
        details: 'Razorpay integration is not properly configured' 
      });
    }

    const { amount, currency, receipt, orderId } = req.body;

    // Validate the order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the user is authorized
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to create payment for this order' });
    }

    // Create Razorpay order
    // Ensure amount is an integer in paise (multiply by 100 and round)
    const amountInPaise = Math.round(amount * 100);
    
    const options = {
      amount: amountInPaise, // Razorpay expects amount in paise as an integer
      currency: currency || 'INR',
      receipt: receipt || `receipt_${orderId}`,
      payment_capture: 1, // Auto-capture
    };
    
    console.log('Amount in rupees:', amount);
    console.log('Amount in paise (integer):', amountInPaise);

    try {
      console.log('Creating Razorpay order with options:', options);
      const razorpayOrder = await razorpay.orders.create(options);
      console.log('Razorpay order created successfully:', razorpayOrder);

      // Update the order with the Razorpay order ID
      await Order.findByIdAndUpdate(orderId, {
        'paymentResult.razorpay_order_id': razorpayOrder.id
      });

      res.json({
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
        key: process.env.RAZORPAY_KEY_ID,
      });
    } catch (razorpayError) {
      console.error('Razorpay API error:', razorpayError);
      
      // For demo/testing purposes, create a mock Razorpay order ID
      // In production, you would want to handle this differently
      const mockOrderId = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      
      // Update the order with the mock Razorpay order ID
      await Order.findByIdAndUpdate(orderId, {
        'paymentResult.razorpay_order_id': mockOrderId,
        'paymentResult.mock': true
      });
      
      res.json({
        id: mockOrderId,
        amount: amountInPaise, // Use the same integer amount in paise
        currency: currency || 'INR',
        receipt: receipt || `receipt_${orderId}`,
        key: process.env.RAZORPAY_KEY_ID,
        mock: true
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
// @access  Private
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // Validate the order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the user is authorized
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to verify payment for this order' });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update order payment status
    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'processing';
    order.paymentStatus = 'completed';
    order.paymentResult = {
      id: razorpay_payment_id,
      status: 'completed',
      update_time: Date.now(),
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    };

    const updatedOrder = await order.save();

    res.json({
      message: 'Payment verified successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get Razorpay payment details
// @route   GET /api/payment/:paymentId
// @access  Private/Admin
exports.getRazorpayPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await razorpay.payments.fetch(paymentId);

    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Refund Razorpay payment
// @route   POST /api/payment/refund
// @access  Private/Admin
exports.refundRazorpayPayment = async (req, res) => {
  try {
    const { paymentId, amount, notes } = req.body;

    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100, // Razorpay expects amount in paise
      notes,
    });

    res.json({
      message: 'Refund initiated successfully',
      refund,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
