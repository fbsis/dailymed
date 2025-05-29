import { GetDrugUseCase } from '@/domain/use-cases/GetDrugUseCase';
import { DrugRepository } from '@/domain/repositories/DrugRepository';
import { ICacheService } from '@/domain/protocols/ICacheService';

describe('GetDrugUseCase', () => {
  it('should exist', () => {
    expect(GetDrugUseCase).toBeDefined();
  });

  it('should be instantiable', () => {
    const mockDrugRepository = {} as DrugRepository;
    const mockCacheService = {} as ICacheService;

    const useCase = new GetDrugUseCase(
      mockDrugRepository,
      mockCacheService
    );

    expect(useCase).toBeInstanceOf(GetDrugUseCase);
  });
}); 