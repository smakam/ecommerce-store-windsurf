const User = require('../models/user.model');
const { generateToken } = require('../middleware/auth.middleware');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const passport = require('passport');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role === 'seller' ? 'seller' : 'user', // Only allow user or seller during registration
      verificationToken,
    });

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    const message = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Email Verification',
      html: `
        <h1>Verify Your Email</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" target="_blank">Verify Email</a>
      `,
    };

    await transporter.sendMail(message);

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        message: 'Registration successful. Please check your email to verify your account.',
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully. You can now login.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email before logging in' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  console.log('getUserProfile called');
  console.log('req.user:', req.user);
  
  try {
    console.log('Attempting to find user with ID:', req.user._id);
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
      console.log('User found:', user.email);
      res.json(user);
    } else {
      console.error('User not found with ID:', req.user._id);
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      if (req.body.address) {
        user.address = {
          ...user.address,
          ...req.body.address
        };
      }
      
      user.phone = req.body.phone || user.phone;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        address: updatedUser.address,
        phone: updatedUser.phone,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No user with that email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

    await user.save();

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Password Reset',
      html: `
        <h1>You requested a password reset</h1>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}" target="_blank">Reset Password</a>
        <p>This link will expire in 30 minutes.</p>
      `,
    };

    await transporter.sendMail(message);

    res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    console.error(error);

    // Reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Google OAuth login
// @route   GET /api/auth/google
// @access  Public
exports.googleAuth = (req, res, next) => {
  console.log('Google Auth Route Hit');
  console.log('Client ID:', process.env.GOOGLE_CLIENT_ID);
  console.log('Callback URL:', process.env.GOOGLE_CALLBACK_URL);
  
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
exports.googleAuthCallback = (req, res, next) => {
  console.log('Google Auth Callback Route Hit');
  console.log('Request query:', req.query);
  console.log('Request headers:', {
    origin: req.headers.origin,
    referer: req.headers.referer,
    host: req.headers.host
  });
  console.log('Environment variables:', {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    FRONTEND_URL: process.env.FRONTEND_URL
  });
  
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Google Auth Error:', err);
      return next(err);
    }
    
    if (info) {
      console.log('Google Auth Info:', info);
    }
    
    if (!user) {
      console.log('No user returned from Google Auth');
      
      // Get the origin from the request headers or use the FRONTEND_URL as fallback
      const origin = req.headers.origin || req.headers.referer || process.env.FRONTEND_URL;
      console.log('Request origin (error):', origin);
      
      // Determine which frontend URL to use for error redirect
      let errorRedirectUrl;
      
      // Check if the request is coming from a Vercel preview URL
      if (origin && /https:\/\/ecommerce-store-windsurf[-.a-z0-9]+-srees-projects-ef0574fa\.vercel\.app/.test(origin)) {
        // Extract the exact preview URL from the origin
        const previewUrlMatch = origin.match(/(https:\/\/ecommerce-store-windsurf[-.a-z0-9]+-srees-projects-ef0574fa\.vercel\.app)/i);
        const previewUrl = previewUrlMatch ? previewUrlMatch[1] : process.env.FRONTEND_URL;
        errorRedirectUrl = `${previewUrl}/login/debug?error=auth_failed&source=google_oauth_error&time=${Date.now()}`;
        console.log('Using preview URL for error redirect to debug page:', errorRedirectUrl);
      } 
      // Check if the request is coming from localhost
      else if (origin && origin.includes('localhost')) {
        errorRedirectUrl = `http://localhost:3000/login/debug?error=auth_failed&source=google_oauth_error&time=${Date.now()}`;
        console.log('Using localhost for error redirect to debug page:', errorRedirectUrl);
      }
      // Default to the main production URL
      else {
        errorRedirectUrl = `${process.env.FRONTEND_URL}/login/debug?error=auth_failed&source=google_oauth_error&time=${Date.now()}`;
        console.log('Using production URL for error redirect to debug page:', errorRedirectUrl);
      }
      
      // Add additional debug information to the response headers
      res.setHeader('X-Auth-Debug-Error', 'auth_failed');
      res.setHeader('X-Auth-Debug-Origin', origin || 'none');
      res.setHeader('X-Auth-Debug-Time', new Date().toISOString());
      
      console.log('Error redirecting to:', errorRedirectUrl);
      return res.redirect(errorRedirectUrl);
    }

    console.log('Google Auth Success, User:', user.email);
    const token = generateToken(user._id);
    
    // Get the origin from the request headers or use the FRONTEND_URL as fallback
    const origin = req.headers.origin || req.headers.referer || process.env.FRONTEND_URL;
    console.log('Request origin:', origin);
    
    // Determine which frontend URL to use for redirect
    let redirectUrl;
    
    // Check if the request is coming from a Vercel preview URL
    if (origin && /https:\/\/ecommerce-store-windsurf[-.a-z0-9]+-srees-projects-ef0574fa\.vercel\.app/.test(origin)) {
      // Extract the exact preview URL from the origin
      const previewUrlMatch = origin.match(/(https:\/\/ecommerce-store-windsurf[-.a-z0-9]+-srees-projects-ef0574fa\.vercel\.app)/i);
      const previewUrl = previewUrlMatch ? previewUrlMatch[1] : process.env.FRONTEND_URL;
      
      // Use debug page instead of success page
      redirectUrl = `${previewUrl}/login/debug?token=${token}&source=google_oauth&time=${Date.now()}`;
      console.log('Using preview URL for redirect to debug page:', redirectUrl);
    } 
    // Check if the request is coming from localhost
    else if (origin && origin.includes('localhost')) {
      redirectUrl = `http://localhost:3000/login/debug?token=${token}&source=google_oauth&time=${Date.now()}`;
      console.log('Using localhost for redirect to debug page:', redirectUrl);
    }
    // Default to the main production URL
    else {
      redirectUrl = `${process.env.FRONTEND_URL}/login/debug?token=${token}&source=google_oauth&time=${Date.now()}`;
      console.log('Using production URL for redirect to debug page:', redirectUrl);
    }
    
    // Add additional debug information to the response headers
    res.setHeader('X-Auth-Debug-Token', token ? token.substring(0, 10) + '...' : 'none');
    res.setHeader('X-Auth-Debug-Origin', origin || 'none');
    res.setHeader('X-Auth-Debug-Time', new Date().toISOString());
    
    console.log('Redirecting to:', redirectUrl);
    
    // Redirect to frontend with token
    res.redirect(redirectUrl);
  })(req, res, next);
};
