import { Drug } from "@/domain/entities/Drug";
import { dailyMedQueue, createQueue } from "../config/queue";
import { DrugMapper } from "../mappers/DrugMapper";
import { QueueEvents } from "bullmq";
import {
  DailyMedCheckResult,
  DailyMedExtractResult,
} from "../queue/processors/dailyMedProcessor";
import { createWorker } from "../config/queue";
import { QUEUE_NAMES } from "../config/queue";
import { DailyMedApiService } from "./dailyMedApi";
import { AxiosHttpClient } from "../http/httpClient";
import { Queue } from "bullmq";

const extractDrugInfoQueue = createQueue<{ setId: string }>(QUEUE_NAMES.DAILYMED_EXTRACT);
const checkQueueEvents = new QueueEvents(QUEUE_NAMES.DAILYMED_CHECK);
const extractQueueEvents = new QueueEvents(QUEUE_NAMES.DAILYMED_EXTRACT);

export class DailyMedQueueService {
  private queues: Map<string, Queue>;

  constructor() {
    this.queues = new Map();
    this.initializeQueues();
  }

  private initializeQueues(): void {
    this.queues.set(QUEUE_NAMES.DAILYMED_CHECK, dailyMedQueue);
    this.queues.set(QUEUE_NAMES.DAILYMED_EXTRACT, extractDrugInfoQueue);
  }

  async checkDrugExists(drugName: string): Promise<string | null> {
    const job = await dailyMedQueue.add("check-drug", { drugName });
    const result = (await job.waitUntilFinished(
      checkQueueEvents
    )) as DailyMedCheckResult;

    if (!result || !result.setId) {
      return null;
    }

    return result.setId;
  }

  async extractDrugInfo(setId: string): Promise<Drug> {
    const job = await extractDrugInfoQueue.add("extract-drug-info", { setId });
    const result = (await job.waitUntilFinished(
      extractQueueEvents
    )) as DailyMedExtractResult;

    if (!result || !result.drugData) {
      throw new Error("Failed to extract drug info from DailyMed");
    }

    return DrugMapper.toDomain(result.drugData);
  }

  getQueue(name: string): Queue {
    const queue = this.queues.get(name);
    if (!queue) {
      throw new Error(`Queue ${name} not found`);
    }
    return queue;
  }
}

// Worker for checking drug existence
createWorker<{ drugName: string }, DailyMedCheckResult>(
  QUEUE_NAMES.DAILYMED_CHECK,
  async ({ data }) => {
    const dailyMedApiService = new DailyMedApiService(new AxiosHttpClient("https://dailymed.nlm.nih.gov/dailymed/services/v2"));
    return dailyMedApiService.checkDrugExists(data.drugName);
  }
);

// Worker for extracting drug info
createWorker<{ setId: string }, DailyMedExtractResult>(
  QUEUE_NAMES.DAILYMED_EXTRACT,
  async ({ data }) => {
    const dailyMedApiService = new DailyMedApiService(new AxiosHttpClient("https://dailymed.nlm.nih.gov/dailymed/services/v2"));
    const drugInfo = await dailyMedApiService.extractDrugInfo(data.setId);
    return { drugData: drugInfo };
  }
);
