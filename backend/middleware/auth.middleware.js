const passport = require('passport');
const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT token
const authenticateJWT = passport.authenticate('jwt', { session: false });

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  console.log('isAuthenticated middleware called');
  console.log('Authorization header:', req.headers.authorization);
  
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.error('JWT Authentication error:', err);
      return next(err);
    }
    if (!user) {
      console.error('JWT Authentication failed. Info:', info);
      console.error('JWT Secret being used:', process.env.JWT_SECRET ? 'JWT_SECRET is set' : 'JWT_SECRET is NOT set');
      return res.status(401).json({ message: 'Unauthorized. Please login to access this resource' });
    }
    console.log('JWT Authentication successful for user:', user.email);
    req.user = user;
    next();
  })(req, res, next);
};

// Middleware to check if user is a seller
const isSeller = (req, res, next) => {
  if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Seller privileges required' });
  }
};

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required' });
  }
};

// Middleware to check if user is verified
const isVerified = (req, res, next) => {
  if (req.user && req.user.isVerified) {
    next();
  } else {
    res.status(403).json({ message: 'Email verification required. Please verify your email address' });
  }
};

// Middleware to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  authenticateJWT,
  isAuthenticated,
  isSeller,
  isAdmin,
  isVerified,
  generateToken,
};
