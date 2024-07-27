import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL;  // Renamed for better naming convention consistency

// Utility function to connect to MongoDB
const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,  // Ensures that Mongoose uses createIndex instead of ensureIndex
      useFindAndModify: false,  // Disables older findAndModify() in favor of findOneAndUpdate()
      autoIndex: true,  // Automatically build indexes defined in your schema
      poolSize: 10,  // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000,  // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000,  // Close sockets after 45 seconds of inactivity
      family: 4  // Use IPv4, skip trying IPv6
    };

    await mongoose.connect(MONGO_URL, options);
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    console.error('Attempting to reconnect...');
    setTimeout(connectDB, 5000);  // Try to reconnect every 5 seconds if initial connection fails
  }
};

export default connectDB;
