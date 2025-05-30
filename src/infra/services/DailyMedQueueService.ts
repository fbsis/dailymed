import { Drug } from "@/domain/entities/Drug";
import { dailyMedQueue, createQueue, QUEUE_NAMES } from "../config/queue";
import { QueueEvents } from "bullmq";
import {
  DailyMedCheckResult,
  DailyMedExtractResult,
} from "../queue/processors/dailyMedProcessor";
import { createWorker } from "../config/queue";
import { DailyMedApiService } from "./dailyMedApi";
import { Queue } from "bullmq";
import { AIConsultationService } from "./AIConsultationService";
import { AxiosHttpClient } from "../http/httpClient";

const extractDrugInfoQueue = createQueue<{ setId: string }>(QUEUE_NAMES.DAILYMED_EXTRACT);
const checkQueueEvents = new QueueEvents(QUEUE_NAMES.DAILYMED_CHECK);
const extractQueueEvents = new QueueEvents(QUEUE_NAMES.DAILYMED_EXTRACT);

export class DailyMedQueueService {
  private queues: Map<string, Queue>;
  private workers: any[] = [];
  private readonly baseUrl = 'https://dailymed.nlm.nih.gov/dailymed/services/v2';

  constructor() {
    this.queues = new Map();
    this.initializeQueues();
    this.initializeWorkers();
  }

  private initializeQueues(): void {
    this.queues.set(QUEUE_NAMES.DAILYMED_CHECK, dailyMedQueue);
    this.queues.set(QUEUE_NAMES.DAILYMED_EXTRACT, extractDrugInfoQueue);
  }

  initializeWorkers(): void {
    // Worker for checking drug existence
    const checkWorker = createWorker<{ drugName: string }, DailyMedCheckResult>(
      QUEUE_NAMES.DAILYMED_CHECK,
      async ({ data }) => {
        const httpClient = new AxiosHttpClient(this.baseUrl);
        const dailyMedApiService = new DailyMedApiService(httpClient);
        const result = await dailyMedApiService.checkDrugExists(data.drugName);
        return { setId: result.setId };
      }
    );

    // Worker for extracting drug info
    const extractWorker = createWorker<{ setId: string }, DailyMedExtractResult>(
      QUEUE_NAMES.DAILYMED_EXTRACT,
      async ({ data }) => {
        const httpClient = new AxiosHttpClient(this.baseUrl);
        const dailyMedApiService = new DailyMedApiService(httpClient);
        const drugInfo = await dailyMedApiService.extractDrugInfo(data.setId);
        return { drugData: drugInfo };
      }
    );

    this.workers.push(checkWorker, extractWorker);
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

    // Use AI service to process the HTML and get structured drug data
    const aiService = new AIConsultationService();
    return aiService.validateIndications(result.drugData.html);
  }

  getQueue(name: string): Queue {
    const queue = this.queues.get(name);
    if (!queue) {
      throw new Error(`Queue ${name} not found`);
    }
    return queue;
  }
}
