import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dailymed';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  // Check if already disconnected
  if (mongoose.connection.readyState === 0) {
    return;
  }

  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
}; 