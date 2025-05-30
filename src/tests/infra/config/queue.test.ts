import { createQueue, createWorker, QUEUE_NAMES, dailyMedQueue, aiConsultationQueue } from '@/infra/config/queue';

describe('Queue Configuration', () => {
  it('should export createQueue function', () => {
    expect(createQueue).toBeDefined();
    expect(typeof createQueue).toBe('function');
  });

  it('should export createWorker function', () => {
    expect(createWorker).toBeDefined();
    expect(typeof createWorker).toBe('function');
  });

}); 