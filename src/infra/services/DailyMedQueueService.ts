import { dailyMedQueue, createQueue, QUEUE_NAMES } from "../config/queue";
import { QueueEvents } from "bullmq";
import {
  DailyMedCheckResult,
} from "../queue/processors/dailyMedProcessor";
import { createWorker } from "../config/queue";
import { DailyMedApiService } from "./dailyMedApi";
import { Queue } from "bullmq";
import { AxiosHttpClient } from "../http/httpClient";
import { DrugInfo } from "./dailyMedApi";
import { Drug } from "@/domain/entities/Drug";
import { AIConsultationService } from "./AIConsultationService";

const extractDrugInfoQueue = createQueue<{ setId: string }>(QUEUE_NAMES.DAILYMED_EXTRACT);
const aiConsultationQueue = createQueue<{ html: string }>(QUEUE_NAMES.AI_CONSULTATION);
const checkQueueEvents = new QueueEvents(QUEUE_NAMES.DAILYMED_CHECK);
const extractQueueEvents = new QueueEvents(QUEUE_NAMES.DAILYMED_EXTRACT);
const aiConsultationQueueEvents = new QueueEvents(QUEUE_NAMES.AI_CONSULTATION);

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
    this.queues.set(QUEUE_NAMES.AI_CONSULTATION, aiConsultationQueue);
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
    const extractWorker = createWorker<{ setId: string }, DrugInfo>(
      QUEUE_NAMES.DAILYMED_EXTRACT,
      async ({ data }) => {
        const httpClient = new AxiosHttpClient(this.baseUrl);
        const dailyMedApiService = new DailyMedApiService(httpClient);
        const drugInfo = await dailyMedApiService.extractDrugInfo(data.setId);
        return drugInfo;
      }
    );

    // Worker for AI consultation
    const aiConsultationWorker = createWorker<{ html: string }, Drug>(
      QUEUE_NAMES.AI_CONSULTATION,
      async ({ data }) => {
        const aiService = new AIConsultationService();
        return aiService.validateIndications(data.html);
      }
    );

    this.workers.push(checkWorker, extractWorker, aiConsultationWorker);
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
    // First, get the raw HTML from DailyMed
    const extractJob = await extractDrugInfoQueue.add("extract-drug-info", { setId });
    const drugInfo = (await extractJob.waitUntilFinished(
      extractQueueEvents
    )) as DrugInfo;

    if (!drugInfo || !drugInfo.html) {
      throw new Error("Failed to extract drug info from DailyMed");
    }

    // Then, process the HTML with AI
    const aiJob = await aiConsultationQueue.add("validate-indications", { html: drugInfo.html });
    const drug = (await aiJob.waitUntilFinished(
      aiConsultationQueueEvents
    )) as Drug;

    if (!drug) {
      throw new Error("Failed to process drug info with AI");
    }

    return drug;
  }

  getQueue(name: string): Queue {
    const queue = this.queues.get(name);
    if (!queue) {
      throw new Error(`Queue ${name} not found`);
    }
    return queue;
  }
}
