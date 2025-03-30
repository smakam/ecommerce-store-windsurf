const express = require('express');
const categoryController = require('../controllers/category.controller');
const { isAuthenticated, isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', categoryController.getCategories);

// @route   GET /api/categories/:id
// @desc    Get category by ID
// @access  Public
router.get('/:id', categoryController.getCategoryById);

// @route   POST /api/categories
// @desc    Create a category
// @access  Private/Admin
router.post('/', isAuthenticated, isAdmin, categoryController.createCategory);

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private/Admin
router.put('/:id', isAuthenticated, isAdmin, categoryController.updateCategory);

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private/Admin
router.delete('/:id', isAuthenticated, isAdmin, categoryController.deleteCategory);

module.exports = router;
