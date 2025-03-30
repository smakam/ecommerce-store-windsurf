const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const { validationResult } = require('express-validator');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.product',
        select: 'name price images countInStock seller',
        populate: {
          path: 'seller',
          select: 'name'
        }
      });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { productId, quantity } = req.body;

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if quantity is valid
    if (quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    // Check if product is in stock
    if (product.countInStock < quantity) {
      return res.status(400).json({ message: 'Product is out of stock or has insufficient quantity' });
    }

    // Find user's cart
    let cart = await Cart.findOne({ user: req.user._id });

    // If cart doesn't exist, create a new one
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    // Check if product already exists in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    // If product exists in cart, update quantity
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        name: product.name,
        image: product.images[0],
        price: product.discountPrice > 0 ? product.discountPrice : product.price,
        quantity,
      });
    }

    await cart.save();

    // Populate product details before sending response
    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price images countInStock seller',
      populate: {
        path: 'seller',
        select: 'name'
      }
    });

    res.status(201).json(populatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    // Validate quantity
    if (quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Get product to check stock
    const product = await Product.findById(cart.items[itemIndex].product);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if quantity is valid
    if (product.countInStock < quantity) {
      return res.status(400).json({ message: 'Product has insufficient quantity in stock' });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;

    await cart.save();

    // Populate product details before sending response
    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price images countInStock seller',
      populate: {
        path: 'seller',
        select: 'name'
      }
    });

    res.json(populatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Find user's cart
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove item from cart
    cart.items = cart.items.filter(
      (item) => item._id.toString() !== itemId
    );

    await cart.save();

    // Populate product details before sending response
    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price images countInStock seller',
      populate: {
        path: 'seller',
        select: 'name'
      }
    });

    res.json(populatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    // Find user's cart
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Clear cart items
    cart.items = [];

    await cart.save();

    res.json({ message: 'Cart cleared successfully', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
