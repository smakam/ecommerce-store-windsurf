const express = require('express');
const { check } = require('express-validator');
const cartController = require('../controllers/cart.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user cart
// @access  Private
router.get('/', isAuthenticated, cartController.getCart);

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private
router.post(
  '/',
  isAuthenticated,
  [
    check('productId', 'Product ID is required').not().isEmpty(),
    check('quantity', 'Quantity must be a positive number').isInt({ min: 1 }),
  ],
  cartController.addToCart
);

// @route   PUT /api/cart/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put(
  '/:itemId',
  isAuthenticated,
  [check('quantity', 'Quantity must be a positive number').isInt({ min: 1 })],
  cartController.updateCartItem
);

// @route   DELETE /api/cart/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/:itemId', isAuthenticated, cartController.removeCartItem);

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Private
router.delete('/', isAuthenticated, cartController.clearCart);

module.exports = router;
