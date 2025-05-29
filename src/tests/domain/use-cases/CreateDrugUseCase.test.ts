import { CreateDrugUseCase } from '@/domain/use-cases/CreateDrugUseCase';
import { DrugRepository } from '@/domain/repositories/DrugRepository';
import { IDailyMedService } from '@/domain/protocols/IDailyMedService';
import { IAIConsultationService } from '@/domain/protocols/IAIConsultationService';
import { ICacheService } from '@/domain/protocols/ICacheService';

describe('CreateDrugUseCase', () => {
  it('should exist', () => {
    expect(CreateDrugUseCase).toBeDefined();
  });

  it('should be instantiable', () => {
    const mockDrugRepository = {} as DrugRepository;
    const mockDailyMedService = {} as IDailyMedService;
    const mockAIConsultationService = {} as IAIConsultationService;
    const mockCacheService = {} as ICacheService;

    const useCase = new CreateDrugUseCase(
      mockDrugRepository,
      mockDailyMedService,
      mockAIConsultationService,
      mockCacheService
    );

    expect(useCase).toBeInstanceOf(CreateDrugUseCase);
  });
}); 