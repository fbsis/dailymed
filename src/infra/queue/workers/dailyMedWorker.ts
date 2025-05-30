import { createWorker } from '@/infra/config/queue';
import { QUEUE_NAMES } from '@/infra/config/queue';
import { DailyMedProcessor, DailyMedCheckResult, DailyMedExtractResult } from '../processors/dailyMedProcessor';

const processor = new DailyMedProcessor();

// Worker for checking drug existence
createWorker<{ drugName: string }, DailyMedCheckResult>(
  QUEUE_NAMES.DAILYMED_CHECK,
  async ({ data }) => {
    return processor.checkDrugExists(data.drugName);
  }
);

// Worker for extracting drug info
createWorker<{ setId: string }, DailyMedExtractResult>(
  'extract-drug-info',
  async ({ data }) => {
    return processor.extractDrugInfo(data.setId);
  }
); 