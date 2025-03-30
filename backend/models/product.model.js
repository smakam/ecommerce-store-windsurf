const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    images: {
      type: Array,
      default: [],
      // Using a custom validator to handle both formats of images
      validate: {
        validator: function(images) {
          // Allow empty array
          if (images.length === 0) return true;
          
          // For each image, check if it's either a string, has a url property, or has numbered keys (unusual format)
          return images.every(img => {
            return typeof img === 'string' || 
                   (img && img.url) || 
                   (typeof img === 'object' && Object.keys(img).some(key => !isNaN(parseInt(key))));
          });
        },
        message: 'Images must be in a valid format'
      }
    },
    
    // Keep a separate field for image metadata that's not required
    imageMetadata: [
      {
        url: String,
        publicId: String,
        isMain: {
          type: Boolean,
          default: false,
        }
      },
    ],
    brand: {
      type: String,
      required: [true, 'Brand name is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      default: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: [true, 'Stock count is required'],
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    specifications: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for calculating discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.discountPrice && this.price > this.discountPrice) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

// Set virtuals to true when converting to JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
