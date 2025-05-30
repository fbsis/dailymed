import { Redis } from 'ioredis';

export const createRedisClient = (): Redis => {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  const redis = new Redis(redisUrl);

  redis.on('error', (error) => {
    console.error('Redis Client Error:', error);
  });

  redis.on('connect', () => {
    console.log('Connected to Redis');
  });

  return redis;
};

export const createRedisSubscriber = (): Redis => {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  const subscriber = new Redis(redisUrl);

  subscriber.on('error', (error) => {
    console.error('Redis Subscriber Error:', error);
  });

  return subscriber;
};

export const createRedisPublisher = (): Redis => {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  const publisher = new Redis(redisUrl);

  publisher.on('error', (error) => {
    console.error('Redis Publisher Error:', error);
  });

  return publisher;
}; 