const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const passport = require('passport');
const session = require('express-session');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// Allow multiple origins for CORS to support both production and preview URLs
const allowedOrigins = [
  'https://ecommerce-store-windsurf.vercel.app',
  'https://ecommerce-store-windsurf-aji890kck-srees-projects-ef0574fa.vercel.app',
  // Include localhost for development
  'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log('CORS blocked origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      return callback(null, false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add session support for OAuth
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport config
require('./config/passport')(passport);

// Define routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/cart', require('./routes/cart.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/payment', require('./routes/payment.routes'));
app.use('/api/categories', require('./routes/category.routes'));
// Temporarily commenting out upload routes due to an issue
// app.use('/api/upload', require('./routes/upload.routes'));

// Default route
app.get('/', (req, res) => {
  res.send('E-commerce API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
