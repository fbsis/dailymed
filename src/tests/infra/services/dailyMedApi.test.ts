import { DailyMedApiService, DrugInfo } from "@/infra/services/dailyMedApi";
import { HttpClient } from "@/infra/http/httpClient";
import Redis from "ioredis";

jest.mock("ioredis");
const MockedRedis = Redis as jest.MockedClass<typeof Redis>;

describe("DailyMedApiService", () => {
  let dailyMedApi: DailyMedApiService;
  let mockHttpClient: jest.Mocked<HttpClient>;
  let mockRedisClient: jest.Mocked<Redis>;

  beforeEach(() => {
    // Mock console.error to prevent error logs during tests
    jest.spyOn(console, "error").mockImplementation(() => {});

    mockHttpClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };

    mockRedisClient = {
      get: jest.fn(),
      set: jest.fn(),
    } as any;

    MockedRedis.mockImplementation(() => mockRedisClient);
    dailyMedApi = new DailyMedApiService(mockHttpClient);
  });

  afterEach(() => {
    // Restore console.error after each test
    jest.restoreAllMocks();
  });

  describe("constructor", () => {
    it("should create an instance of DailyMedApiService", () => {
      expect(dailyMedApi).toBeInstanceOf(DailyMedApiService);
    });
  });

  describe("checkDrugExists", () => {
    it("should return setId when drug exists", async () => {
      const mockResponse = {
        data: [
          {
            spl_version: 1,
            published_date: "2024-01-01",
            title: "Test Drug",
            setid: "test-set-id",
          },
        ],
      };
      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await dailyMedApi.checkDrugExists("Test Drug");

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining("/spls"),
        expect.objectContaining({
          params: { drug_name: "Test Drug" },
        })
      );
      expect(result).toEqual({ setId: "test-set-id" });
    });

    it("should return null when drug does not exist", async () => {
      const mockResponse = { data: [] };
      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await dailyMedApi.checkDrugExists("Non Existent Drug");

      expect(result).toEqual({ setId: null });
    });

    it("should return null when API call fails", async () => {
      mockHttpClient.get.mockRejectedValue(new Error("API Error"));

      const result = await dailyMedApi.checkDrugExists("Test Drug");

      expect(result).toEqual({ setId: null });
    });
  });

  describe("extractDrugInfo", () => {
    const mockSetId = "test-set-id-123";
    const mockHtml = "<html><body>Test Drug Info</body></html>";
    const mockDrugInfo: DrugInfo = {
      html: mockHtml,
      lastUpdated: expect.any(String),
    };

    it("should return cached data when available", async () => {
      mockRedisClient.get.mockResolvedValue(JSON.stringify(mockDrugInfo));

      const result = await dailyMedApi.extractDrugInfo(mockSetId);

      expect(mockRedisClient.get).toHaveBeenCalledWith(mockSetId);
      expect(mockHttpClient.get).not.toHaveBeenCalled();
      expect(result).not.toBeNull();
    });

    it("should fetch and cache data when not in cache", async () => {
      mockRedisClient.get.mockResolvedValue(null);
      mockHttpClient.get.mockResolvedValue(mockHtml);

      const result = await dailyMedApi.extractDrugInfo(mockSetId);

      expect(mockRedisClient.get).toHaveBeenCalledWith(mockSetId);
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining("fdaDrugXsl.cfm"),
        expect.objectContaining({
          params: {
            setid: mockSetId,
            type: "display",
          },
        })
      );
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        mockSetId,
        expect.stringContaining(mockHtml)
      );
      expect(result).toEqual(
        expect.objectContaining({
          html: mockHtml,
          lastUpdated: expect.any(String),
        })
      );
    });

    it("should throw error when API call fails", async () => {
      mockRedisClient.get.mockResolvedValue(null);
      mockHttpClient.get.mockRejectedValue(new Error("API Error"));

      await expect(dailyMedApi.extractDrugInfo(mockSetId)).rejects.toThrow(
        "Failed to extract drug information"
      );

      expect(mockRedisClient.get).toHaveBeenCalledWith(mockSetId);
      expect(mockHttpClient.get).toHaveBeenCalled();
      expect(mockRedisClient.set).not.toHaveBeenCalled();
    });

    it("should throw error when cache read fails", async () => {
      mockRedisClient.get.mockRejectedValue(new Error("Cache Error"));

      await expect(dailyMedApi.extractDrugInfo(mockSetId)).rejects.toThrow(
        "Failed to extract drug information"
      );

      expect(mockRedisClient.get).toHaveBeenCalledWith(mockSetId);
      expect(mockHttpClient.get).not.toHaveBeenCalled();
    });
  });
});
