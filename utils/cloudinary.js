const cloudinary = require("cloudinary").v2;
const config = require("config");

cloudinary.config({
  cloud_name: config.get("cloudinary").cloud_name,
  api_key: config.get("cloudinary").api_key,
  api_secret: config.get("cloudinary").api_secret,
});

module.exports = cloudinary;
