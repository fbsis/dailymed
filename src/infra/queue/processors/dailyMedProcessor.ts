import { DailyMedApiService, DrugInfo } from '@/infra/services/dailyMedApi';
import { AxiosHttpClient } from '@/infra/http/httpClient';

export interface DailyMedCheckResult {
  setId: string | null;
}

export interface DailyMedExtractResult {
  drugData: any; // This would be properly typed based on DailyMed API response
}

export class DailyMedProcessor {
  private readonly dailyMedApi: DailyMedApiService;

  constructor() {
    const httpClient = new AxiosHttpClient('https://dailymed.nlm.nih.gov/dailymed/services/v2');
    this.dailyMedApi = new DailyMedApiService(httpClient);
  }

  async checkDrugExists(drugName: string): Promise<DailyMedCheckResult> {
    return this.dailyMedApi.checkDrugExists(drugName);
  }

  async extractDrugInfo(setId: string): Promise<DrugInfo> {
    return this.dailyMedApi.extractDrugInfo(setId);
  }
} 