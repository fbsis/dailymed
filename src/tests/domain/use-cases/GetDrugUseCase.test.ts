import { GetDrugUseCase } from '@/domain/use-cases/GetDrugUseCase';
import { DrugRepository } from '@/domain/repositories/DrugRepository';
import { ICacheService } from '@/domain/protocols/ICacheService';
import { Drug } from '@/domain/entities/Drug';
import { DrugName } from '@/domain/value-objects/DrugName';
import { IdentificationCode } from '@/domain/value-objects/IdentificationCode';
import { Indication } from '@/domain/entities/Indication';
import { Dosage } from '@/domain/entities/Dosage';
import { DrugNotFoundError } from '@/domain/errors/DrugNotFoundError';

describe('GetDrugUseCase', () => {
  let useCase: GetDrugUseCase;
  let mockDrugRepository: jest.Mocked<DrugRepository>;
  let mockCacheService: jest.Mocked<ICacheService>;

  const mockDrug = new Drug(
    new DrugName('Aspirin'),
    new IdentificationCode('123e4567-e89b-12d3-a456-426614174000'),
    [] as Indication[],
    {} as Dosage
  );

  beforeEach(() => {
    mockDrugRepository = {
      findByName: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as jest.Mocked<DrugRepository>;

    mockCacheService = {
      getDrug: jest.fn(),
      setDrug: jest.fn(),
      removeDrug: jest.fn()
    } as jest.Mocked<ICacheService>;

    useCase = new GetDrugUseCase(
      mockDrugRepository,
      mockCacheService
    );
  });

  it('should exist', () => {
    expect(GetDrugUseCase).toBeDefined();
  });

  it('should be instantiable', () => {
    expect(useCase).toBeInstanceOf(GetDrugUseCase);
  });

  describe('execute', () => {
    const drugName = 'Aspirin';

    it('should return drug from cache when available', async () => {
      mockCacheService.getDrug.mockResolvedValue(mockDrug);

      const result = await useCase.execute(drugName);

      expect(result).toBe(mockDrug);
      expect(mockCacheService.getDrug).toHaveBeenCalledWith(drugName);
      expect(mockDrugRepository.findByName).not.toHaveBeenCalled();
      expect(mockCacheService.setDrug).not.toHaveBeenCalled();
    });

    it('should get drug from database and cache it when not in cache', async () => {
      mockCacheService.getDrug.mockResolvedValue(null);
      mockDrugRepository.findByName.mockResolvedValue(mockDrug);

      const result = await useCase.execute(drugName);

      expect(result).toBe(mockDrug);
      expect(mockCacheService.getDrug).toHaveBeenCalledWith(drugName);
      expect(mockDrugRepository.findByName).toHaveBeenCalledWith(drugName);
      expect(mockCacheService.setDrug).toHaveBeenCalledWith(mockDrug);
    });

    it('should throw DrugNotFoundError when drug not found in cache or database', async () => {
      mockCacheService.getDrug.mockResolvedValue(null);
      mockDrugRepository.findByName.mockResolvedValue(null);

      await expect(useCase.execute(drugName)).rejects.toThrow(DrugNotFoundError);
      expect(mockCacheService.getDrug).toHaveBeenCalledWith(drugName);
      expect(mockDrugRepository.findByName).toHaveBeenCalledWith(drugName);
      expect(mockCacheService.setDrug).not.toHaveBeenCalled();
    });
  });
}); 