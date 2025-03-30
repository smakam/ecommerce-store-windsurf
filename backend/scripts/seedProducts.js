const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Seed products
const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
    
    // Find an existing seller or admin user to use as the product seller
    console.log('Finding a seller or admin user...');
    let seller = await User.findOne({ $or: [{ isSeller: true }, { isAdmin: true }] });
    
    if (!seller) {
      console.log('No seller or admin found, creating a new seller user...');
      // Create a unique email to avoid conflicts
      const uniqueEmail = `seller_${Date.now()}@example.com`;
      
      seller = new User({
        name: 'Seller User',
        email: uniqueEmail,
        password: bcrypt.hashSync('123456', 10),
        isSeller: true,
        isVerified: true
      });
      seller = await seller.save();
      console.log(`Created new seller with ID: ${seller._id}`);
    } else {
      console.log(`Using existing user with ID: ${seller._id} as seller`);
    }
    
    const sellerId = seller._id;
    
    // Get all categories
    const categories = await Category.find({});
    if (categories.length === 0) {
      console.error('No categories found. Please run seedCategories.js first.');
      process.exit(1);
    }

    // Map category names to IDs
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Sample products
    const products = [
      {
        name: 'iPhone 13 Pro',
        description: 'Latest iPhone with A15 Bionic chip and Pro camera system',
        price: 999.99,
        category: categoryMap['Electronics'],
        countInStock: 15,
        rating: 4.8,
        numReviews: 12,
        images: [
          'https://images.unsplash.com/photo-1632661674596-618e45337a12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80'
        ],
        brand: 'Apple',
        isFeatured: true,
        seller: sellerId
      },
      {
        name: 'MacBook Pro 16"',
        description: 'Powerful laptop with M1 Pro chip for professionals',
        price: 2399.99,
        category: categoryMap['Electronics'],
        countInStock: 7,
        rating: 4.9,
        numReviews: 8,
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1026&q=80'
        ],
        brand: 'Apple',
        isFeatured: true,
        seller: sellerId
      },
      {
        name: 'Men\'s Casual Shirt',
        description: 'Comfortable cotton shirt for casual wear',
        price: 29.99,
        category: categoryMap['Clothing'],
        countInStock: 25,
        rating: 4.5,
        numReviews: 10,
        images: [
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80'
        ],
        brand: 'Fashion Co.',
        isFeatured: false,
        seller: sellerId
      },
      {
        name: 'Women\'s Summer Dress',
        description: 'Light and comfortable dress for summer',
        price: 49.99,
        category: categoryMap['Clothing'],
        countInStock: 20,
        rating: 4.7,
        numReviews: 15,
        images: [
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=746&q=80'
        ],
        brand: 'Fashion Co.',
        isFeatured: true,
        seller: sellerId
      },
      {
        name: 'The Alchemist',
        description: 'A novel by Paulo Coelho about following your dreams',
        price: 12.99,
        category: categoryMap['Books'],
        countInStock: 50,
        rating: 4.8,
        numReviews: 120,
        images: [
          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
        ],
        brand: 'HarperOne',
        isFeatured: false,
        seller: sellerId
      },
      {
        name: 'Coffee Maker',
        description: 'Automatic coffee maker with timer',
        price: 89.99,
        category: categoryMap['Home & Kitchen'],
        countInStock: 12,
        rating: 4.6,
        numReviews: 25,
        images: [
          'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        ],
        brand: 'HomeStyle',
        isFeatured: true,
        seller: sellerId
      },
      {
        name: 'Facial Cleanser',
        description: 'Gentle facial cleanser for all skin types',
        price: 19.99,
        category: categoryMap['Beauty'],
        countInStock: 30,
        rating: 4.7,
        numReviews: 45,
        images: [
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        ],
        brand: 'GlowSkin',
        isFeatured: false,
        seller: sellerId
      },
      {
        name: 'LEGO Star Wars Set',
        description: 'Build your own Star Wars spaceship',
        price: 79.99,
        category: categoryMap['Toys'],
        countInStock: 8,
        rating: 4.9,
        numReviews: 18,
        images: [
          'https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80'
        ],
        brand: 'LEGO',
        isFeatured: true,
        seller: sellerId
      }
    ];

    // Clear existing products
    await Product.deleteMany({});
    console.log('Deleted existing products');
    
    // Insert new products
    const createdProducts = await Product.insertMany(products);
    console.log(`Inserted ${createdProducts.length} products`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
    return true;
  } catch (error) {
    console.error('Error seeding products:', error);
    // Try to disconnect in case of error
    try {
      await mongoose.disconnect();
    } catch (err) {
      // Ignore disconnect error
    }
    process.exit(1);
  }
};

// Run the seed function
seedProducts();
