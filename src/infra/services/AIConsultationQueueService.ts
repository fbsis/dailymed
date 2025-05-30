import { IAIConsultationService } from '@/domain/protocols/IAIConsultationService';
import { aiConsultationQueue } from '../config/queue';
import { QueueEvents } from 'bullmq';
import { AIConsultationResult } from '../queue/processors/aiConsultationProcessor';

const queueEvents = new QueueEvents('ai-consultation');

export class AIConsultationQueueService implements IAIConsultationService {
  async validateIndications(indications: Indication[]): Promise<Indication[]> {
    const job = await aiConsultationQueue.add('validate-indications', {
      drugName: 'current-drug',
      indications: indications.map(i => i.getDescription().getValue())
    });

    const result = await job.waitUntilFinished(queueEvents) as AIConsultationResult;

    if (!result || !result.validatedIndications) {
      throw new Error('Failed to validate indications with AI');
    }

    return result.validatedIndications.map(desc => new Indication(
      new IndicationCode(desc),
      new Condition(desc),
      new Description(desc)
    ));
  }
}

// Worker implementation (this would typically be in a separate file)
import { createWorker } from '../config/queue';
import { QUEUE_NAMES } from '../config/queue';
import { Indication } from '@/domain/entities/Indication';
import { Description } from '@/domain/value-objects/Description';
import { Condition } from '@/domain/value-objects/Condition';
import { IndicationCode } from '@/domain/value-objects/IndicationCode';

// Worker for validating indications
createWorker<{ drugName: string; indications: string[] }, { validatedIndications: string[] }>(
  QUEUE_NAMES.AI_CONSULTATION,
  async ({ data }) => {
    // Here you would implement the actual OpenAI API call
    // For now, we'll simulate a response
    return {
      validatedIndications: data.indications.filter(indication =>
        // Simulate some basic validation
        indication.length > 0 && indication.length <= 200
      )
    };
  }
); 