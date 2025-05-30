import { createQueue, createWorker, QUEUE_NAMES, dailyMedQueue, aiConsultationQueue } from '@/infra/config/queue';

// Setup mocks
jest.mock('ioredis');
jest.mock('@/infra/config/redis');

describe('Queue Configuration', () => {
  beforeEach(() => {
    // Mock console.error to prevent error logs during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    jest.restoreAllMocks();
  });

  it('should have createQueue function defined', () => {
    expect(createQueue).toBeDefined();
    expect(typeof createQueue).toBe('function');
  });

  it('should have createWorker function defined', () => {
    expect(createWorker).toBeDefined();
    expect(typeof createWorker).toBe('function');
  });

  it('should have QUEUE_NAMES constant defined with expected properties', () => {
    expect(QUEUE_NAMES).toBeDefined();
    expect(QUEUE_NAMES).toHaveProperty('DAILYMED_CHECK');
    expect(QUEUE_NAMES).toHaveProperty('AI_CONSULTATION');
  });

  it('should have queue instances defined', () => {
    expect(dailyMedQueue).toBeDefined();
    expect(aiConsultationQueue).toBeDefined();
  });
}); 