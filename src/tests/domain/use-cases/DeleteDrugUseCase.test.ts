import { DeleteDrugUseCase } from '@/domain/use-cases/DeleteDrugUseCase';
import { DrugRepository } from '@/domain/repositories/DrugRepository';
import { ICacheService } from '@/domain/protocols/ICacheService';
import { Drug } from '@/domain/entities/Drug';
import { DrugName } from '@/domain/value-objects/DrugName';
import { IdentificationCode } from '@/domain/value-objects/IdentificationCode';
import { Indication } from '@/domain/entities/Indication';
import { Dosage } from '@/domain/entities/Dosage';
import { DrugNotFoundError } from '@/domain/errors/DrugNotFoundError';

describe('DeleteDrugUseCase', () => {
  let useCase: DeleteDrugUseCase;
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

    useCase = new DeleteDrugUseCase(
      mockDrugRepository,
      mockCacheService
    );
  });

  it('should exist', () => {
    expect(DeleteDrugUseCase).toBeDefined();
  });

  it('should be instantiable', () => {
    expect(useCase).toBeInstanceOf(DeleteDrugUseCase);
  });

  describe('execute', () => {
    const drugName = 'Aspirin';

    it('should throw DrugNotFoundError when drug not found in database', async () => {
      mockDrugRepository.findByName.mockResolvedValue(null);

      await expect(useCase.execute(drugName)).rejects.toThrow(DrugNotFoundError);
      expect(mockDrugRepository.findByName).toHaveBeenCalledWith(drugName);
      expect(mockDrugRepository.delete).not.toHaveBeenCalled();
      expect(mockCacheService.removeDrug).not.toHaveBeenCalled();
    });

    it('should delete drug from both database and cache when found', async () => {
      mockDrugRepository.findByName.mockResolvedValue(mockDrug);

      await useCase.execute(drugName);

      expect(mockDrugRepository.findByName).toHaveBeenCalledWith(drugName);
      expect(mockDrugRepository.delete).toHaveBeenCalledWith(drugName);
      expect(mockCacheService.removeDrug).toHaveBeenCalledWith(drugName);
    });

    it('should handle errors during deletion', async () => {
      mockDrugRepository.findByName.mockResolvedValue(mockDrug);
      mockDrugRepository.delete.mockRejectedValue(new Error('Database error'));

      await expect(useCase.execute(drugName)).rejects.toThrow('Database error');
      expect(mockDrugRepository.findByName).toHaveBeenCalledWith(drugName);
      expect(mockDrugRepository.delete).toHaveBeenCalledWith(drugName);
      expect(mockCacheService.removeDrug).toHaveBeenCalledWith(drugName);
    });
  });
}); 