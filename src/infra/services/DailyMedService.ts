import { IDailyMedService } from '@/domain/protocols/IDailyMedService';
import { DrugInfo, DailyMedApiService } from './dailyMedApi';
import { DailyMedQueueService } from './DailyMedQueueService';
import { AxiosHttpClient } from '../http/httpClient';

export class DailyMedService implements IDailyMedService {
  private queueService: DailyMedQueueService;
  apiService: DailyMedApiService;

  constructor() {
    this.queueService = new DailyMedQueueService();
    this.apiService = new DailyMedApiService(new AxiosHttpClient('https://dailymed.nlm.nih.gov/dailymed/services/v2'));
  }

  async checkDrugExists(drugName: string): Promise<string | null> {
    return this.queueService.checkDrugExists(drugName);
  }

  async extractDrugInfo(setId: string): Promise<DrugInfo> {
    // First get the raw HTML from DailyMed API
    const drugInfo = await this.apiService.extractDrugInfo(setId);
       
    // Return the original DrugInfo since that's what the interface expects
    return drugInfo;
  }
} 