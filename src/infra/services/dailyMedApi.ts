import { HttpClient } from '../http/httpClient';
import { createRedisClient } from '../config/redis';

interface DailyMedSearchResponse {
  data: Array<{
    spl_version: number;
    published_date: string;
    title: string;
    setid: string;
  }>;
  metadata: {
    db_published_date: string;
    elements_per_page: number;
    current_url: string;
    next_page_url: string | null;
    total_elements: number;
    total_pages: number;
    current_page: number;
    previous_page: string | null;
    previous_page_url: string | null;
    next_page: string | null;
  };
}

export interface DrugInfo {
  html: string;
  lastUpdated: string;
}

export class DailyMedApiService {
  private readonly baseUrl = 'https://dailymed.nlm.nih.gov/dailymed/services/v2';
  private readonly redisClient = createRedisClient();

  constructor(private readonly httpClient: HttpClient) {}

  async checkDrugExists(drugName: string): Promise<{ setId: string | null }> {
    try {
      const response = await this.httpClient.get<DailyMedSearchResponse>(
        `${this.baseUrl}/spls`,
        {
          params: { drug_name: drugName }
        }
      );

      if (!response.data || response.data.length === 0) {
        return { setId: null };
      }

      // Return the first matching drug's setId
      return { setId: response.data[0].setid };
    } catch (error) {
      console.error('Error checking drug existence:', error);
      return { setId: null };
    }
  }

  async extractDrugInfo(setId: string): Promise<DrugInfo> {
    try {
      // Try to get from cache first
      const cachedData = await this.redisClient.get(setId);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      // If not in cache, fetch from API
      const response = await this.httpClient.get<string>(
        `https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm`,
        {
          params: {
            setid: setId,
            type: 'display'
          }
        }
      );

      const drugInfo: DrugInfo = {
        html: response,
        lastUpdated: new Date().toISOString()
      };

      // Store in cache permanently (no expiration)
      await this.redisClient.set(setId, JSON.stringify(drugInfo));

      return drugInfo;
    } catch (error) {
      console.error('Error extracting drug info:', error);
      throw new Error('Failed to extract drug information');
    }
  }
} 