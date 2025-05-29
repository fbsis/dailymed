import { UpdateDrugUseCase } from '@/domain/use-cases/UpdateDrugUseCase';
import { DrugRepository } from '@/domain/repositories/DrugRepository';
import { IDailyMedService } from '@/domain/protocols/IDailyMedService';
import { IAIConsultationService } from '@/domain/protocols/IAIConsultationService';
import { ICacheService } from '@/domain/protocols/ICacheService';

describe('UpdateDrugUseCase', () => {
  it('should exist', () => {
    expect(UpdateDrugUseCase).toBeDefined();
  });

  it('should be instantiable', () => {
    const mockDrugRepository = {} as DrugRepository;
    const mockDailyMedService = {} as IDailyMedService;
    const mockAIConsultationService = {} as IAIConsultationService;
    const mockCacheService = {} as ICacheService;

    const useCase = new UpdateDrugUseCase(
      mockDrugRepository,
      mockDailyMedService,
      mockAIConsultationService,
      mockCacheService
    );

    expect(useCase).toBeInstanceOf(UpdateDrugUseCase);
  });
});