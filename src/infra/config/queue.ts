import { Queue, Worker } from 'bullmq';
import { createRedisClient } from './redis';

export const QUEUE_NAMES = {
  DAILYMED_CHECK: 'dailymed-check',
  DAILYMED_EXTRACT: 'dailymed-extract',
  AI_CONSULTATION: 'ai-consultation'
} as const;

// Global queue options
const defaultQueueOptions = {
  connection: createRedisClient(),
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000 // 1 second
    },
    removeOnComplete: true,
    removeOnFail: false
  }
};

// Global worker options
const defaultWorkerOptions = {
  connection: createRedisClient(),
  concurrency: 1,
  limiter: {
    max: 1000,
    duration: 1000
  }
};

export const createQueue = <T>(name: string): Queue<T> => {
  return new Queue<T>(name, defaultQueueOptions);
};

export const createWorker = <T, R>(
  name: string,
  processor: (job: { data: T }) => Promise<R>
): Worker<T, R> => {
  return new Worker<T, R>(name, processor, defaultWorkerOptions);
};

// Queue instances
export const dailyMedQueue = createQueue<{ drugName: string }>(QUEUE_NAMES.DAILYMED_CHECK);
export const aiConsultationQueue = createQueue<{ html: string }>(QUEUE_NAMES.AI_CONSULTATION); 