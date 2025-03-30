const fs = require('fs');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const Product = require('../models/product.model');

// @desc    Upload product images to Cloudinary
// @route   POST /api/upload/product/:productId
// @access  Private/Seller
exports.uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const productId = req.params.productId;
    
    // Check if product exists and belongs to the seller
    const product = await Product.findById(productId);
    
    if (!product) {
      // Delete the local file
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Verify seller ownership
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      // Delete the local file
      fs.unlinkSync(req.file.path);
      return res.status(403).json({ error: 'Not authorized to update this product' });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.path, 'ecommerce/products');
    
    // Delete the local file after upload
    fs.unlinkSync(req.file.path);
    
    // Add image to product
    const newImage = {
      url: result.url,
      publicId: result.public_id,
      isMain: product.images.length === 0 // First image is main by default
    };
    
    product.images.push(newImage);
    await product.save();
    
    res.json({
      success: true,
      image: newImage,
      product: {
        id: product._id,
        name: product.name,
        images: product.images
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    // Clean up local file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Server error during upload' });
  }
};

// @desc    Delete product image from Cloudinary
// @route   DELETE /api/upload/product/:productId/:imageId
// @access  Private/Seller
exports.deleteProductImage = async (req, res) => {
  try {
    const { productId, imageId } = req.params;
    
    // Check if product exists and belongs to the seller
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Verify seller ownership
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this product' });
    }
    
    // Find the image in the product
    const imageIndex = product.images.findIndex(img => img._id.toString() === imageId);
    
    if (imageIndex === -1) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    const image = product.images[imageIndex];
    
    // Delete from Cloudinary if publicId exists
    if (image.publicId) {
      await deleteFromCloudinary(image.publicId);
    }
    
    // Remove image from product
    product.images.splice(imageIndex, 1);
    
    // If deleted image was main and there are other images, set first image as main
    if (image.isMain && product.images.length > 0) {
      product.images[0].isMain = true;
    }
    
    await product.save();
    
    res.json({
      success: true,
      message: 'Image deleted successfully',
      product: {
        id: product._id,
        name: product.name,
        images: product.images
      }
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Server error during deletion' });
  }
};

// @desc    Set product main image
// @route   PUT /api/upload/product/:productId/main/:imageId
// @access  Private/Seller
exports.setMainImage = async (req, res) => {
  try {
    const { productId, imageId } = req.params;
    
    // Check if product exists and belongs to the seller
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Verify seller ownership
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this product' });
    }
    
    // Find the image in the product
    const imageIndex = product.images.findIndex(img => img._id.toString() === imageId);
    
    if (imageIndex === -1) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    // Update main image
    product.images.forEach((img, index) => {
      img.isMain = index === imageIndex;
    });
    
    await product.save();
    
    res.json({
      success: true,
      message: 'Main image updated successfully',
      product: {
        id: product._id,
        name: product.name,
        images: product.images
      }
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Server error during update' });
  }
};
