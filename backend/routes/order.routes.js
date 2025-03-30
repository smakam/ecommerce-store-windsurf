const express = require('express');
const { check } = require('express-validator');
const orderController = require('../controllers/order.controller');
const { isAuthenticated, isSeller, isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post(
  '/',
  isAuthenticated,
  [
    check('orderItems', 'Order items are required').isArray({ min: 1 }),
    check('shippingAddress', 'Shipping address is required').not().isEmpty(),
    check('paymentMethod', 'Payment method is required').not().isEmpty(),
    check('itemsPrice', 'Items price is required').isNumeric(),
    check('taxPrice', 'Tax price is required').isNumeric(),
    check('shippingPrice', 'Shipping price is required').isNumeric(),
    check('totalPrice', 'Total price is required').isNumeric(),
  ],
  orderController.createOrder
);

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private
router.get('/myorders', isAuthenticated, orderController.getMyOrders);

// @route   GET /api/orders/seller
// @desc    Get seller orders
// @access  Private/Seller
router.get('/seller', isAuthenticated, isSeller, orderController.getSellerOrders);

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private/Admin
router.get('/', isAuthenticated, isAdmin, orderController.getOrders);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', isAuthenticated, orderController.getOrderById);

// @route   PUT /api/orders/:id/pay
// @desc    Update order to paid
// @access  Private
router.put('/:id/pay', isAuthenticated, orderController.updateOrderToPaid);

// @route   PUT /api/orders/:id/deliver
// @desc    Update order to delivered
// @access  Private/Admin/Seller
router.put('/:id/deliver', isAuthenticated, isSeller, orderController.updateOrderToDelivered);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin/Seller
router.put('/:id/status', isAuthenticated, isSeller, orderController.updateOrderStatus);

module.exports = router;
