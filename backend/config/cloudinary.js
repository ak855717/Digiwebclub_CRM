const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUD_NAME',
  api_key: process.env.CLOUDINARY_API_KEY || '318641891317795',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'R1G-aQDnCH-vKShp2wtGdU5YVks'
});

module.exports = cloudinary;
