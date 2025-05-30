import { Queue, Worker } from 'bullmq';
import { createRedisClient } from './redis';

export const QUEUE_NAMES = {
  DAILYMED_CHECK: 'dailymed-check',
  DAILYMED_EXTRACT: 'dailymed-extract',
  AI_CONSULTATION: 'ai-consultation'
} as const;

export const createQueue = <T>(name: string): Queue<T> => {
  const connection = createRedisClient();
  return new Queue<T>(name, { connection });
};

export const createWorker = <T, R>(
  name: string,
  processor: (job: { data: T }) => Promise<R>
): Worker<T, R> => {
  const connection = createRedisClient();
  return new Worker<T, R>(name, processor, { connection });
};

// Queue instances
export const dailyMedQueue = createQueue<{ drugName: string }>(QUEUE_NAMES.DAILYMED_CHECK);
export const aiConsultationQueue = createQueue<{ html: string }>(QUEUE_NAMES.AI_CONSULTATION); 