import { Drug } from '../entities/Drug';
import { DrugRepository } from '../repositories/DrugRepository';
import { IDailyMedService } from '../protocols/IDailyMedService';
import { IAIConsultationService } from '../protocols/IAIConsultationService';
import { ICacheService } from '../protocols/ICacheService';
import { DrugNotFoundError } from '../errors/DrugNotFoundError';
import { DrugName } from '../value-objects/DrugName';

export class CreateDrugUseCase {
  constructor(
    private readonly drugRepository: DrugRepository,
    private readonly dailyMedService: IDailyMedService,
    private readonly aiConsultationService: IAIConsultationService,
    private readonly cacheService: ICacheService
  ) {}

  async execute(drugName: DrugName): Promise<Drug> {
    // Check if drug exists in DailyMed
    const setId = await this.dailyMedService.checkDrugExists(drugName.getValue());
    if (!setId) {
      throw new DrugNotFoundError(drugName.getValue());
    }

    // Check if drug already exists in database
    const existingDrug = await this.drugRepository.findByName(drugName.getValue());
    if (existingDrug) {
      return existingDrug;
    }

    // Extract drug information from DailyMed
    const extractedDrug = await this.dailyMedService.extractDrugInfo(setId);

    // Validate indications with AI
    const drug = await this.aiConsultationService.validateIndications(
      extractedDrug.html
    );

    // Save to database and cache
    await Promise.all([
      this.drugRepository.save(drug),
      this.cacheService.setDrug(drug)
    ]);

    return drug;
  }
} 