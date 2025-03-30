/**
 * Utility functions for handling image data
 */

/**
 * Process image data to handle various formats
 * @param {Object|String} imageData - The image data to process
 * @returns {String} - A string URL or empty string if invalid
 */
const processImageData = (imageData) => {
  // If it's a string, return it directly
  if (typeof imageData === 'string') {
    return imageData;
  }
  
  // If it has a url property, return that
  if (imageData && imageData.url) {
    return imageData.url;
  }
  
  // If it's the unusual format with numbered keys
  if (typeof imageData === 'object' && Object.keys(imageData).length > 100) {
    return Object.keys(imageData)
      .filter(key => !isNaN(parseInt(key)))
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(key => imageData[key])
      .join('');
  }
  
  // Default fallback
  return '';
};

module.exports = {
  processImageData
};
