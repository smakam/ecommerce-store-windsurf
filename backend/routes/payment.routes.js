const express = require('express');
const paymentController = require('../controllers/payment.controller');
const { isAuthenticated, isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// @route   POST /api/payment/create-order
// @desc    Create Razorpay order
// @access  Private
router.post('/create-order', isAuthenticated, paymentController.createRazorpayOrder);

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment
// @access  Private
router.post('/verify', isAuthenticated, paymentController.verifyRazorpayPayment);

// @route   GET /api/payment/:paymentId
// @desc    Get Razorpay payment details
// @access  Private/Admin
router.get('/:paymentId', isAuthenticated, isAdmin, paymentController.getRazorpayPayment);

// @route   POST /api/payment/refund
// @desc    Refund Razorpay payment
// @access  Private/Admin
router.post('/refund', isAuthenticated, isAdmin, paymentController.refundRazorpayPayment);

module.exports = router;
