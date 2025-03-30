const express = require('express');
const { check } = require('express-validator');
const productController = require('../controllers/product.controller');
const { isAuthenticated, isSeller, isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', productController.getProducts);

// @route   GET /api/products/top
// @desc    Get top rated products
// @access  Public
router.get('/top', productController.getTopProducts);

// @route   GET /api/products/seller
// @desc    Get products by seller
// @access  Private/Seller
router.get('/seller', isAuthenticated, isSeller, productController.getSellerProducts);

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', productController.getProductById);

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Seller
router.post(
  '/',
  isAuthenticated,
  isSeller,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('brand', 'Brand is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('price', 'Price is required and must be a number').isNumeric(),
    check('countInStock', 'Count in stock is required and must be a number').isNumeric(),
    check('images', 'At least one image is required').isArray({ min: 1 }),
  ],
  productController.createProduct
);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Seller
router.put(
  '/:id',
  isAuthenticated,
  isSeller,
  productController.updateProduct
);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Seller
router.delete(
  '/:id',
  isAuthenticated,
  isSeller,
  productController.deleteProduct
);

// @route   POST /api/products/:id/reviews
// @desc    Create new review
// @access  Private
router.post(
  '/:id/reviews',
  isAuthenticated,
  [
    check('rating', 'Rating is required and must be between 1 and 5').isFloat({ min: 1, max: 5 }),
    check('comment', 'Comment is required').not().isEmpty(),
  ],
  productController.createProductReview
);

module.exports = router;
