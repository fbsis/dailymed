import { Server } from 'http';
import { connectDatabase } from '@/infra/config/database';

// Mock database connection
jest.mock('@/infra/config/database', () => ({
  connectDatabase: jest.fn().mockResolvedValue(undefined)
}));

// Mock app
const mockListen = jest.fn((_port: number, callback: () => void) => {
  callback();
  const mockServer = {
    close: jest.fn((callback: () => void) => callback())
  } as unknown as Server;
  return mockServer;
});

jest.mock('../app', () => ({
  __esModule: true,
  default: {
    listen: mockListen
  }
}));

// Import the server module
const startServer = require('../server').startServer;

describe('Server', () => {
  const originalEnv = process.env;
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
  const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });

  describe('Server Startup', () => {
    it('should start server on default port 3000', async () => {
      delete process.env.PORT;
      
      await startServer();
      
      expect(mockConsoleLog).toHaveBeenCalledWith('Server is running on port 3000');
      expect(mockConsoleLog).toHaveBeenCalledWith('API documentation available at http://localhost:3000/api-docs');
    });

  });

  describe('Database Connection', () => {
    it('should connect to database before starting server', async () => {
      const connectDatabaseMock = connectDatabase as jest.Mock;
      
      await startServer();
      
      expect(connectDatabaseMock).toHaveBeenCalled();
      expect(mockListen).toHaveBeenCalled();
      
      // Verify database connection happens before server start
      const dbCallOrder = connectDatabaseMock.mock.invocationCallOrder[0];
      const serverCallOrder = mockListen.mock.invocationCallOrder[0];
      expect(dbCallOrder).toBeLessThan(serverCallOrder);
    });

  });
}); 