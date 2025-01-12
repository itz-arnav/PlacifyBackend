import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
  throw new Error('MONGO_URL environment variable is not defined.');
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    console.error('Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
