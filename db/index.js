import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL; // Ensure this is correctly set in your environment variables

// Utility function to connect to MongoDB
const connectDB = async () => {
  try {
    // Connect to MongoDB without the deprecated options
    await mongoose.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    });
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    console.error('Attempting to reconnect...');
    setTimeout(connectDB, 5000); // Try to reconnect every 5 seconds if initial connection fails
  }
};

export default connectDB;
