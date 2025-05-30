import { IAIConsultationService } from '@/domain/protocols/IAIConsultationService';
import { aiConsultationQueue } from '../config/queue';
import { QueueEvents } from 'bullmq';
import { Queue } from 'bullmq';
import { Drug } from '@/domain/entities/Drug';

const queueEvents = new QueueEvents('ai-consultation');

export class AIConsultationQueueService implements IAIConsultationService {
  private queues: Map<string, Queue>;

  constructor() {
    this.queues = new Map();
    this.initializeQueues();
  }

  private initializeQueues(): void {
    this.queues.set(QUEUE_NAMES.AI_CONSULTATION, aiConsultationQueue);
  }

  async validateIndications(html: string): Promise<Drug> {
    const job = await aiConsultationQueue.add('validate-indications', {
      html
    });

    console.log(html);
    throw new Error('Not implemented');
    const result = await job.waitUntilFinished(queueEvents);

    if (!result || !result.validatedIndications) {
      throw new Error('Failed to validate indications with AI');
    }

    return result;
  }

  getQueue(name: string): Queue {
    const queue = this.queues.get(name);
    if (!queue) {
      throw new Error(`Queue ${name} not found`);
    }
    return queue;
  }
}

// Worker implementation (this would typically be in a separate file)
import { createWorker } from '../config/queue';
import { QUEUE_NAMES } from '../config/queue';

// Worker for validating indications
createWorker<{ html: string }, Drug>(
  QUEUE_NAMES.AI_CONSULTATION,
  async ({ data }) => {
    console.log(data);
    throw new Error('Not implemented');
  }
); 