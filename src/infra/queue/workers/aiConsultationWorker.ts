import { createWorker } from '@/infra/config/queue';
import { QUEUE_NAMES } from '@/infra/config/queue';
import { AIConsultationProcessor, AIConsultationResult } from '../processors/aiConsultationProcessor';

const processor = new AIConsultationProcessor();

createWorker<{ drugName: string; indications: string[] }, AIConsultationResult>(
  QUEUE_NAMES.AI_CONSULTATION,
  async ({ data }) => {
    return processor.validateIndications(data.indications);
  }
); 