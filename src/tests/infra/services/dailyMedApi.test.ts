import { DailyMedApiService } from '@/infra/services/dailyMedApi';
import { HttpClient } from '@/infra/http/httpClient';

describe('DailyMedApiService', () => {
  let dailyMedApi: DailyMedApiService;
  let mockHttpClient: jest.Mocked<HttpClient>;

  beforeEach(() => {
    mockHttpClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    };
    dailyMedApi = new DailyMedApiService(mockHttpClient);
  });

  describe('constructor', () => {
    it('should create an instance of DailyMedApiService', () => {
      expect(dailyMedApi).toBeInstanceOf(DailyMedApiService);
    });
  });

 
}); 