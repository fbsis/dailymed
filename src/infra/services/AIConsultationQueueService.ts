import { IAIConsultationService } from '@/domain/protocols/IAIConsultationService';
import { aiConsultationQueue } from '../config/queue';
import { QueueEvents } from 'bullmq';
import { Queue } from 'bullmq';
import { Drug } from '@/domain/entities/Drug';
import { QUEUE_NAMES } from '../config/queue';

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