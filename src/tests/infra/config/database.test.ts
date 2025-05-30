import { connectDatabase, disconnectDatabase } from '@/infra/config/database';
import mongoose from 'mongoose';

jest.mock('mongoose', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  connection: {
    readyState: 0
  }
}));

describe('Database Configuration', () => {
  const mockMongoUri = 'mongodb://localhost:27017/dailymed';
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    // Mock console.log and console.error to prevent output during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  describe('connectDatabase', () => {
    it('should connect to MongoDB using default URI when MONGODB_URI is not set', async () => {
      delete process.env.MONGODB_URI;
      (mongoose.connect as jest.Mock).mockResolvedValueOnce(undefined);

      await connectDatabase();

      expect(mongoose.connect).toHaveBeenCalledWith(mockMongoUri);
      expect(console.log).toHaveBeenCalledWith('Connected to MongoDB');
    });

    it('should connect to MongoDB using MONGODB_URI from environment variables', async () => {
      const customUri = 'mongodb://custom:27017/dailymed';
      process.env.MONGODB_URI = customUri;
      (mongoose.connect as jest.Mock).mockResolvedValueOnce(undefined);

      await connectDatabase();

      expect(mongoose.connect).toHaveBeenCalledWith(customUri);
      expect(console.log).toHaveBeenCalledWith('Connected to MongoDB');
    });

    it('should throw error when connection fails', async () => {
      const error = new Error('Connection failed');
      (mongoose.connect as jest.Mock).mockRejectedValueOnce(error);

      await expect(connectDatabase()).rejects.toThrow('Connection failed');
      expect(mongoose.connect).toHaveBeenCalledWith(mockMongoUri);
      expect(console.error).toHaveBeenCalledWith('Error connecting to MongoDB:', error);
    });

    it('should not attempt to connect if already connected', async () => {
      (mongoose.connection.readyState as number) = 1; // Connected state
      (mongoose.connect as jest.Mock).mockResolvedValueOnce(undefined);

      await connectDatabase();

      expect(mongoose.connect).not.toHaveBeenCalled();
    });
  });

  describe('disconnectDatabase', () => {
    it('should disconnect from MongoDB successfully', async () => {
      (mongoose.disconnect as jest.Mock).mockResolvedValueOnce(undefined);

      await disconnectDatabase();

      expect(mongoose.disconnect).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Disconnected from MongoDB');
    });

    it('should throw error when disconnection fails', async () => {
      const error = new Error('Disconnection failed');
      (mongoose.disconnect as jest.Mock).mockRejectedValueOnce(error);

      await expect(disconnectDatabase()).rejects.toThrow('Disconnection failed');
      expect(mongoose.disconnect).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Error disconnecting from MongoDB:', error);
    });

    it('should not attempt to disconnect if already disconnected', async () => {
      (mongoose.connection.readyState as number) = 0; // Disconnected state
      (mongoose.disconnect as jest.Mock).mockResolvedValueOnce(undefined);

      await disconnectDatabase();

      expect(mongoose.disconnect).not.toHaveBeenCalled();
    });
  });
}); 