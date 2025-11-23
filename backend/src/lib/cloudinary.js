import { v2 as cloudinary } from "cloudinary";

import { config } from "dotenv";

config();

// Only configure cloudinary if all required environment variables are present
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("Cloudinary configured successfully");
} else {
  console.log("Cloudinary not configured - profile picture upload will be disabled");
}

export default cloudinary;
