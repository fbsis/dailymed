import { CreateDrugUseCase } from '@/domain/use-cases/CreateDrugUseCase';
import { DrugRepository } from '@/domain/repositories/DrugRepository';
import { IDailyMedService } from '@/domain/protocols/IDailyMedService';
import { IAIConsultationService } from '@/domain/protocols/IAIConsultationService';
import { ICacheService } from '@/domain/protocols/ICacheService';
import { Drug } from '@/domain/entities/Drug';
import { DrugName } from '@/domain/value-objects/DrugName';
import { IdentificationCode } from '@/domain/value-objects/IdentificationCode';
import { Indication } from '@/domain/entities/Indication';
import { Dosage } from '@/domain/entities/Dosage';
import { DrugNotFoundError } from '@/domain/errors/DrugNotFoundError';
import { DrugInfo } from '@/infra/services/dailyMedApi';

describe('CreateDrugUseCase', () => {
  let useCase: CreateDrugUseCase;
  let mockDrugRepository: jest.Mocked<DrugRepository>;
  let mockDailyMedService: jest.Mocked<IDailyMedService>;
  let mockAIConsultationService: jest.Mocked<IAIConsultationService>;
  let mockCacheService: jest.Mocked<ICacheService>;

  const mockDrug = new Drug(
    new DrugName('Aspirin'),
    new IdentificationCode('123e4567-e89b-12d3-a456-426614174000'),
    [] as Indication[],
    {} as Dosage
  );

  const mockDrugInfo: DrugInfo = {
    html: 'Test drug information',
    lastUpdated: new Date().toISOString()
  };

  beforeEach(() => {
    mockDrugRepository = {
      findByName: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as jest.Mocked<DrugRepository>;

    mockDailyMedService = {
      checkDrugExists: jest.fn(),
      extractDrugInfo: jest.fn()
    } as jest.Mocked<IDailyMedService>;

    mockAIConsultationService = {
      validateIndications: jest.fn()
    } as jest.Mocked<IAIConsultationService>;

    mockCacheService = {
      getDrug: jest.fn(),
      setDrug: jest.fn(),
      removeDrug: jest.fn()
    } as jest.Mocked<ICacheService>;

    useCase = new CreateDrugUseCase(
      mockDrugRepository,
      mockDailyMedService,
      mockAIConsultationService,
      mockCacheService
    );
  });

  it('should exist', () => {
    expect(CreateDrugUseCase).toBeDefined();
  });

  it('should be instantiable', () => {
    expect(useCase).toBeInstanceOf(CreateDrugUseCase);
  });

  describe('execute', () => {
    const drugName = new DrugName('Aspirin');
    const setId = 'set-id-123';

    it('should throw DrugNotFoundError when drug does not exist in DailyMed', async () => {
      mockDailyMedService.checkDrugExists.mockResolvedValue(null);

      await expect(useCase.execute(drugName)).rejects.toThrow(DrugNotFoundError);
      expect(mockDailyMedService.checkDrugExists).toHaveBeenCalledWith(drugName.getValue());
      expect(mockDrugRepository.findByName).not.toHaveBeenCalled();
    });

    it('should return existing drug when found in database', async () => {
      mockDailyMedService.checkDrugExists.mockResolvedValue(setId);
      mockDrugRepository.findByName.mockResolvedValue(mockDrug);

      const result = await useCase.execute(drugName);

      expect(result).toBe(mockDrug);
      expect(mockDailyMedService.checkDrugExists).toHaveBeenCalledWith(drugName.getValue());
      expect(mockDrugRepository.findByName).toHaveBeenCalledWith(drugName.getValue());
      expect(mockDailyMedService.extractDrugInfo).not.toHaveBeenCalled();
    });

    it('should create new drug when not found in database', async () => {
      mockDailyMedService.checkDrugExists.mockResolvedValue(setId);
      mockDrugRepository.findByName.mockResolvedValue(null);
      mockDailyMedService.extractDrugInfo.mockResolvedValue(mockDrugInfo);
      mockAIConsultationService.validateIndications.mockResolvedValue(mockDrug);

      const result = await useCase.execute(drugName);

      expect(result).toStrictEqual(mockDrug);
      expect(mockDailyMedService.checkDrugExists).toHaveBeenCalledWith(drugName.getValue());
      expect(mockDrugRepository.findByName).toHaveBeenCalledWith(drugName.getValue());
      expect(mockDailyMedService.extractDrugInfo).toHaveBeenCalledWith(setId);
      expect(mockAIConsultationService.validateIndications).toHaveBeenCalled();
      expect(mockDrugRepository.save).toHaveBeenCalledWith(mockDrug);
      expect(mockCacheService.setDrug).toHaveBeenCalledWith(mockDrug);
    });
  });
}); 