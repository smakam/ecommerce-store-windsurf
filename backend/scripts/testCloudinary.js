const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.production') });

// Ensure Cloudinary credentials are set correctly
process.env.CLOUDINARY_CLOUD_NAME = 'dnz9uiiwx';
process.env.CLOUDINARY_API_KEY = '227277336285136';
process.env.CLOUDINARY_API_SECRET = 'D6zS6duTE5fPG10JOjr_H-bj4Q4';

// Import Cloudinary after setting environment variables
const { cloudinary, uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// Create a test image if it doesn't exist
const createTestImage = () => {
  const testImagePath = path.join(__dirname, 'test-image.png');
  
  if (!fs.existsSync(testImagePath)) {
    // Create a simple 100x100 black PNG image
    const canvas = require('canvas');
    const { createCanvas } = canvas;
    const canvasObj = createCanvas(100, 100);
    const ctx = canvasObj.getContext('2d');
    
    // Fill with black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 100, 100);
    
    // Add some text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px Arial';
    ctx.fillText('Test Image', 10, 50);
    
    // Save to file
    const buffer = canvasObj.toBuffer('image/png');
    fs.writeFileSync(testImagePath, buffer);
    
    console.log(`Created test image at ${testImagePath}`);
  }
  
  return testImagePath;
};

async function testCloudinaryConnection() {
  try {
    console.log('Testing Cloudinary connection...');
    console.log(`Cloud name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    console.log(`API Key: ${process.env.CLOUDINARY_API_KEY.substring(0, 5)}...`);
    
    // Ping Cloudinary to check connection
    const account = await cloudinary.api.ping();
    console.log('Cloudinary connection successful!');
    console.log('Account status:', account.status);
    
    return true;
  } catch (error) {
    console.error('Cloudinary connection failed:', error.message);
    return false;
  }
}

async function testImageUpload() {
  try {
    // First check if we have the canvas package for creating a test image
    try {
      require('canvas');
    } catch (err) {
      console.log('Canvas package not found. Skipping image upload test.');
      console.log('To fully test image uploads, install the canvas package:');
      console.log('npm install canvas');
      return;
    }
    
    const testImagePath = createTestImage();
    
    console.log('\nTesting image upload...');
    const uploadResult = await uploadToCloudinary(testImagePath, 'ecommerce/test');
    
    console.log('Image uploaded successfully!');
    console.log('Image URL:', uploadResult.url);
    console.log('Public ID:', uploadResult.public_id);
    
    // Test deletion
    console.log('\nTesting image deletion...');
    const deleteResult = await deleteFromCloudinary(uploadResult.public_id);
    
    if (deleteResult.success) {
      console.log('Image deleted successfully!');
    } else {
      console.log('Image deletion failed:', deleteResult.message);
    }
    
    return uploadResult;
  } catch (error) {
    console.error('Image upload/delete test failed:', error.message);
    return null;
  }
}

async function runTests() {
  const connectionSuccess = await testCloudinaryConnection();
  
  if (connectionSuccess) {
    await testImageUpload();
  }
  
  console.log('\nCloudinary test completed.');
}

runTests();
