import { createWorker } from '../config/queue';
import { QUEUE_NAMES } from '../config/queue';
import { Drug } from '@/domain/entities/Drug';

// Worker for validating indications
createWorker<{ html: string }, Drug>(
  QUEUE_NAMES.AI_CONSULTATION,
  async ({ data }) => {
    console.log(data);
    throw new Error('Not implemented');
  }
); 