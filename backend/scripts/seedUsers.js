const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Seed users
const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Deleted existing users');
    
    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: '123456', // Will be hashed by the pre-save hook
      isAdmin: true,
      isVerified: true
    });
    
    // Create seller user
    const sellerUser = new User({
      name: 'Seller User',
      email: 'seller@example.com',
      password: '123456', // Will be hashed by the pre-save hook
      isSeller: true,
      isVerified: true
    });
    
    // Create customer user
    const customerUser = new User({
      name: 'Customer User',
      email: 'customer@example.com',
      password: '123456', // Will be hashed by the pre-save hook
      isVerified: true
    });
    
    // Save users to database
    const createdAdmin = await adminUser.save();
    const createdSeller = await sellerUser.save();
    const createdCustomer = await customerUser.save();
    
    console.log('Users created:');
    console.log(`- Admin: ${createdAdmin._id}`);
    console.log(`- Seller: ${createdSeller._id}`);
    console.log(`- Customer: ${createdCustomer._id}`);
    
    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('MongoDB Disconnected');
    
    // Return the seller ID for use in product seeding
    return {
      adminId: createdAdmin._id,
      sellerId: createdSeller._id,
      customerId: createdCustomer._id
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

// If this script is run directly
if (require.main === module) {
  seedUsers()
    .then(() => {
      console.log('User seeding completed');
    })
    .catch(err => {
      console.error('User seeding failed:', err);
    });
} else {
  // Export for use in other scripts
  module.exports = seedUsers;
}
