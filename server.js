import { app, server } from "./app.js"; // Import the app instance and server configuration
import ConnectionToDB from "./config/dbConnection.js";
import cloudinary from "cloudinary"
import dotenv from 'dotenv'


const PORT = process.env.PORT || 5000;

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Start server
const startServer = async () => {
  try {
    await ConnectionToDB(); // Connect to database
    server.listen(PORT, () => {
      console.log(`App is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};



// Call startServer function to initiate server startup
startServer();