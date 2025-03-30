# E-commerce API

Backend API for the e-commerce application.

## Features

- User authentication (JWT, Google OAuth)
- Product management
- Shopping cart functionality
- Order processing
- Payment integration with Razorpay
- Image upload with Cloudinary

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Passport.js for authentication
- Cloudinary for image storage
- Razorpay for payment processing

## Deployment

This API is configured to be deployed on Render.

### Environment Variables

Make sure to set the following environment variables in your Render dashboard:

```
NODE_ENV=production
PORT=10000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-render-app.onrender.com/api/auth/google/callback
FRONTEND_URL=https://your-vercel-app.vercel.app
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=noreply@ecommerce.com
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

### User Routes
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Product Routes
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a product by ID
- `POST /api/products` - Create a new product (seller only)
- `PUT /api/products/:id` - Update a product (seller only)
- `DELETE /api/products/:id` - Delete a product (seller only)

### Cart Routes
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove item from cart

### Order Routes
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create a new order

### Payment Routes
- `POST /api/payment/create-order` - Create a payment order
- `POST /api/payment/verify` - Verify payment

### Category Routes
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create a new category (admin only)
- `PUT /api/categories/:id` - Update a category (admin only)
- `DELETE /api/categories/:id` - Delete a category (admin only)

### Upload Routes
- `POST /api/upload` - Upload an image
- `DELETE /api/upload/:publicId` - Delete an image
- `POST /api/upload/product/:productId` - Upload a product image
- `DELETE /api/upload/product/:productId/:imageId` - Delete a product image
- `PUT /api/upload/product/:productId/main/:imageId` - Set a product image as main
