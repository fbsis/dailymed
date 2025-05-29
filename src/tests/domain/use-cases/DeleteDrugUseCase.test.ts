import { DeleteDrugUseCase } from '@/domain/use-cases/DeleteDrugUseCase';
import { DrugRepository } from '@/domain/repositories/DrugRepository';
import { ICacheService } from '@/domain/protocols/ICacheService';

describe('DeleteDrugUseCase', () => {
  it('should exist', () => {
    expect(DeleteDrugUseCase).toBeDefined();
  });

  it('should be instantiable', () => {
    const mockDrugRepository = {} as DrugRepository;
    const mockCacheService = {} as ICacheService;

    const useCase = new DeleteDrugUseCase(
      mockDrugRepository,
      mockCacheService
    );

    expect(useCase).toBeInstanceOf(DeleteDrugUseCase);
  });
}); 