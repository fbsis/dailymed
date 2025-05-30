// Mock Redis constructor
const mockRedisClient = {
  connect: jest.fn().mockResolvedValue(undefined),
  disconnect: jest.fn().mockResolvedValue(undefined),
  on: jest.fn(),
  off: jest.fn(),
  options: {
    keyPrefix: 'bull:',
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    retryStrategy: jest.fn()
  },
  status: 'ready'
} as any;

// Mock Redis constructor
const Redis = jest.fn().mockImplementation(() => mockRedisClient);

// Mock createRedisClient
export const createRedisClient = jest.fn().mockReturnValue(mockRedisClient);

export default Redis; 