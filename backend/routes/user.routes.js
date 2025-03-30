const express = require('express');
const userController = require('../controllers/user.controller');
const { isAuthenticated, isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', isAuthenticated, isAdmin, userController.getUsers);

// @route   GET /api/users/stats
// @desc    Get user stats
// @access  Private/Admin
router.get('/stats', isAuthenticated, isAdmin, userController.getUserStats);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private/Admin
router.get('/:id', isAuthenticated, isAdmin, userController.getUserById);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private/Admin
router.put('/:id', isAuthenticated, isAdmin, userController.updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/:id', isAuthenticated, isAdmin, userController.deleteUser);

module.exports = router;
