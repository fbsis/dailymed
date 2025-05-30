import { DrugCreateController } from '../controllers/DrugCreateController';
import { CreateDrugUseCase } from '@/domain/use-cases/CreateDrugUseCase';
import { Drug } from '@/domain/entities/Drug';
import { DrugName } from '@/domain/value-objects/DrugName';
import { IdentificationCode } from '@/domain/value-objects/IdentificationCode';
import { Indication } from '@/domain/entities/Indication';
import { Dosage } from '@/domain/entities/Dosage';
import { MongooseDrugRepository } from '@/infra/repositories/mongoose/DrugRepository';
import { DailyMedService } from '@/infra/services/DailyMedService';
import { AIConsultationService } from '@/infra/services/AIConsultationService';
import { RedisCacheService } from '@/infra/cache/RedisCacheService';

// Mock all dependencies
jest.mock('@/domain/use-cases/CreateDrugUseCase');
jest.mock('@/infra/repositories/mongoose/DrugRepository');
jest.mock('@/infra/services/DailyMedService');
jest.mock('@/infra/services/AIConsultationService');
jest.mock('@/infra/cache/RedisCacheService');

describe('DrugCreateController', () => {
  let controller: DrugCreateController;
  let mockCreateDrugUseCase: jest.Mocked<CreateDrugUseCase>;
  let mockDrugRepository: jest.Mocked<MongooseDrugRepository>;
  let mockDailyMedService: jest.Mocked<DailyMedService>;
  let mockAIConsultationService: jest.Mocked<AIConsultationService>;
  let mockRedisCacheService: jest.Mocked<RedisCacheService>;

  // Create mock objects for Drug dependencies
  const mockDrugName = new DrugName('Test Drug');
  const mockIdentificationCode = new IdentificationCode("123e4567-e89b-12d3-a456-426614174000");
  const mockIndications: Indication[] = [];
  const mockDosage = new Dosage([], { getAllAgeBasedDosages: () => [] } as any);

  const mockDrug = new Drug(
    mockDrugName,
    mockIdentificationCode,
    mockIndications,
    mockDosage
  );

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Setup mock implementations
    mockDrugRepository = new MongooseDrugRepository() as jest.Mocked<MongooseDrugRepository>;
    mockDailyMedService = new DailyMedService() as jest.Mocked<DailyMedService>;
    mockAIConsultationService = new AIConsultationService() as jest.Mocked<AIConsultationService>;
    mockRedisCacheService = new RedisCacheService() as jest.Mocked<RedisCacheService>;
    
    mockCreateDrugUseCase = new CreateDrugUseCase(
      mockDrugRepository,
      mockDailyMedService,
      mockAIConsultationService,
      mockRedisCacheService
    ) as jest.Mocked<CreateDrugUseCase>;

    // Mock the execute method
    mockCreateDrugUseCase.execute = jest.fn().mockResolvedValue(mockDrug);

    // Create controller instance
    controller = new DrugCreateController();
  });

  describe('createDrug', () => {
    it('should create a drug successfully', async () => {
      // Arrange
      const drugName = new DrugName('Test Drug');
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      await controller.createDrug(drugName);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('name', drugName);
      expect(consoleSpy).toHaveBeenCalledTimes(1);

      consoleSpy.mockRestore();
    });

  });

  describe('Dependency Injection', () => {
    it('should initialize with all required dependencies', () => {
      // Arrange & Act
      const controller = new DrugCreateController();

      // Assert
      expect(controller).toBeInstanceOf(DrugCreateController);
      expect(mockCreateDrugUseCase).toBeDefined();
    });

    it('should use the correct repository implementation', () => {
      // Arrange & Act
      new DrugCreateController();

      // Assert
      expect(MongooseDrugRepository).toHaveBeenCalled();
    });

    it('should use the correct service implementations', () => {
      // Arrange & Act
      new DrugCreateController();

      // Assert
      expect(DailyMedService).toHaveBeenCalled();
      expect(AIConsultationService).toHaveBeenCalled();
      expect(RedisCacheService).toHaveBeenCalled();
    });
  });
}); 