import { IDailyMedService } from '@/domain/protocols/IDailyMedService';
import { Drug } from '@/domain/entities/Drug';
import { dailyMedQueue, createQueue } from '../config/queue';
import { DrugMapper } from '../mappers/DrugMapper';
import { QueueEvents } from 'bullmq';
import { DailyMedCheckResult, DailyMedExtractResult } from '../queue/processors/dailyMedProcessor';

const extractDrugInfoQueue = createQueue<{ setId: string }>('extract-drug-info');
const queueEvents = new QueueEvents('dailymed-check');

export class DailyMedQueueService implements IDailyMedService {
  async checkDrugExists(drugName: string): Promise<string | null> {
    const job = await dailyMedQueue.add('check-drug', { drugName });
    const result = await job.waitUntilFinished(queueEvents) as DailyMedCheckResult;

    if (!result || !result.setId) {
      return null;
    }

    return result.setId;
  }

  async extractDrugInfo(setId: string): Promise<Drug> {
    const job = await extractDrugInfoQueue.add('extract-drug-info', { setId });
    const result = await job.waitUntilFinished(queueEvents) as DailyMedExtractResult;

    if (!result || !result.drugData) {
      throw new Error('Failed to extract drug info from DailyMed');
    }

    return DrugMapper.toDomain(result.drugData);
  }
}

// Worker implementation (this would typically be in a separate file)
import { createWorker } from '../config/queue';
import { QUEUE_NAMES } from '../config/queue';

// Worker for checking drug existence
createWorker<{ drugName: string }, { setId: string | null }>(
  QUEUE_NAMES.DAILYMED_CHECK,
  async ({ data }) => {
    // Here you would implement the actual DailyMed API call
    // For now, we'll simulate a response
    if (data.drugName.toLowerCase() === 'aspirin') {
      return { setId: 'set-id-123' };
    }
    return { setId: null };
  }
);

// Worker for extracting drug info
createWorker<{ setId: string }, { drugData: any }>(
  QUEUE_NAMES.DAILYMED_CHECK,
  async ({ data }) => {
    // Here you would implement the actual DailyMed API call
    // For now, we'll simulate a response
    return {
      drugData: {
        name: 'Aspirin',
        identificationCode: '123e4567-e89b-12d3-a456-426614174000',
        indications: [
          {
            code: '10.1',
            description: 'Pain relief'
          }
        ],
        dosage: {
          value: '500',
          unit: 'mg'
        }
      }
    };
  }
); 