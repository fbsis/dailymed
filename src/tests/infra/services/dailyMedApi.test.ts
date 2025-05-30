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

  describe('checkDrugExists', () => {
    it('should return setId when drug exists', async () => {
      const mockResponse = {
        data: [{
          spl_version: 1,
          published_date: '2024-01-01',
          title: 'Test Drug',
          setid: 'test-set-id'
        }]
      };
      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await dailyMedApi.checkDrugExists('Test Drug');

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/spls'),
        expect.objectContaining({
          params: { drug_name: 'Test Drug' }
        })
      );
      expect(result).toEqual({ setId: 'test-set-id' });
    });

    it('should return null when drug does not exist', async () => {
      const mockResponse = { data: [] };
      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await dailyMedApi.checkDrugExists('Non Existent Drug');

      expect(result).toEqual({ setId: null });
    });

    it('should return null when API call fails', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('API Error'));

      const result = await dailyMedApi.checkDrugExists('Test Drug');

      expect(result).toEqual({ setId: null });
    });
  });

  describe('extractDrugInfo', () => {
    it('should throw error as not implemented', async () => {
      await expect(dailyMedApi.extractDrugInfo('test-set-id'))
        .rejects
        .toThrow('Drug info extraction not implemented yet');
    });
  });
}); 