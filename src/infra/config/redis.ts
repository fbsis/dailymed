import Redis from 'ioredis';

export const createRedisClient = (): Redis => {
  return new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null
  });
};

export const createRedisSubscriber = (): Redis => {
  return new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null
  });
};

export const createRedisPublisher = (): Redis => {
  return new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null
  });
}; 