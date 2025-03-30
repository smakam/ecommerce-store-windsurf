const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.production') });
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define simplified schemas for testing
const userSchema = new Schema({
  name: String,
  email: String,
  role: String
});

const productSchema = new Schema({
  name: String,
  price: Number,
  description: String
});

const categorySchema = new Schema({
  name: String,
  slug: String
});

// Create models
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Category = mongoose.model('Category', categorySchema);

async function testDatabaseConnection() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas successfully!');
    
    // Count documents in collections
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();
    
    console.log(`\nDatabase Statistics:`);
    console.log(`- Users: ${userCount}`);
    console.log(`- Products: ${productCount}`);
    console.log(`- Categories: ${categoryCount}`);
    
    // Fetch sample data
    console.log('\nSample User:');
    const sampleUser = await User.findOne().select('name email role -_id');
    console.log(sampleUser ? sampleUser.toJSON() : 'No users found');
    
    console.log('\nSample Product:');
    const sampleProduct = await Product.findOne().select('name price -_id');
    console.log(sampleProduct ? sampleProduct.toJSON() : 'No products found');
    
    console.log('\nSample Category:');
    const sampleCategory = await Category.findOne().select('name slug -_id');
    console.log(sampleCategory ? sampleCategory.toJSON() : 'No categories found');
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed.');
  }
}

testDatabaseConnection();
