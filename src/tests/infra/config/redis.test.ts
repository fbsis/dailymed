import { createRedisClient, createRedisSubscriber, createRedisPublisher } from '@/infra/config/redis';

describe('Redis Configuration', () => {
  it('should export createRedisClient function', () => {
    expect(createRedisClient).toBeDefined();
    expect(typeof createRedisClient).toBe('function');
  });

  it('should export createRedisSubscriber function', () => {
    expect(createRedisSubscriber).toBeDefined();
    expect(typeof createRedisSubscriber).toBe('function');
  });

  it('should export createRedisPublisher function', () => {
    expect(createRedisPublisher).toBeDefined();
    expect(typeof createRedisPublisher).toBe('function');
  });
}); 