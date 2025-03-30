const express = require('express');
const router = express.Router();
const fs = require('fs');
const upload = require('../middleware/upload');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const auth = require('../middleware/auth.middleware');
const uploadController = require('../controllers/upload.controller');

// @route   POST /api/upload
// @desc    Upload an image to Cloudinary
// @access  Private
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.path);
    
    // Delete the local file after upload
    fs.unlinkSync(req.file.path);
    
    res.json({
      success: true,
      imageUrl: result.url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server error during upload' });
  }
});

// @route   DELETE /api/upload/:publicId
// @desc    Delete an image from Cloudinary
// @access  Private
router.delete('/:publicId', auth, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    const result = await deleteFromCloudinary(publicId);
    
    if (result.success) {
      return res.json({ success: true, message: 'Image deleted successfully' });
    } else {
      return res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Server error during deletion' });
  }
});

// Product Image Routes

// @route   POST /api/upload/product/:productId
// @desc    Upload a product image to Cloudinary
// @access  Private/Seller
router.post('/product/:productId', auth, upload.single('image'), uploadController.uploadProductImage);

// @route   DELETE /api/upload/product/:productId/:imageId
// @desc    Delete a product image from Cloudinary
// @access  Private/Seller
router.delete('/product/:productId/:imageId', auth, uploadController.deleteProductImage);

// @route   PUT /api/upload/product/:productId/main/:imageId
// @desc    Set a product image as the main image
// @access  Private/Seller
router.put('/product/:productId/main/:imageId', auth, uploadController.setMainImage);

module.exports = router;
