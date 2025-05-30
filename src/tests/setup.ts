// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key';
process.env.MONGODB_URI = 'mongodb://localhost:27017/dailymed-test';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';
process.env.OPENAI_API_KEY = 'test-openai-key';

// Mock console methods to keep test output clean
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Clean up after all tests
afterAll(() => {
  delete process.env.JWT_SECRET;
  delete process.env.MONGODB_URI;
  delete process.env.REDIS_HOST;
  delete process.env.REDIS_PORT;
  delete process.env.OPENAI_API_KEY;
}); 