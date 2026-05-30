const cloudinary = require('cloudinary').v2;

const isConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

/**
 * Uploads a base64 encoded image string to Cloudinary and returns the secure URL.
 * Falls back to returning the original base64 string if Cloudinary is not configured
 * or if the upload fails.
 * 
 * @param {string} base64Str The base64 data URL string (e.g. data:image/png;base64,...)
 * @returns {Promise<string>} The uploaded Cloudinary URL or original base64 fallback.
 */
async function uploadImage(base64Str) {
  if (!isConfigured) {
    console.warn('Cloudinary is not configured. Storing image as raw base64 string.');
    return base64Str;
  }

  // Double check if it's already a HTTP/HTTPS URL (meaning no new upload is required)
  if (typeof base64Str === 'string' && (base64Str.startsWith('http://') || base64Str.startsWith('https://'))) {
    return base64Str;
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Str, {
      folder: 'cuteslk_catalog'
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Cloudinary upload failed. Storing raw base64 string as fallback. Error:', error);
    return base64Str;
  }
}

module.exports = {
  cloudinary,
  isConfigured,
  uploadImage
};
