import { Drug } from '../entities/Drug';
import { DrugRepository } from '../repositories/DrugRepository';
import { IDailyMedService } from '../protocols/IDailyMedService';
import { IAIConsultationService } from '../protocols/IAIConsultationService';
import { ICacheService } from '../protocols/ICacheService';
import { DrugNotFoundError } from '../errors/DrugNotFoundError';

export class CreateDrugUseCase {
  constructor(
    private readonly drugRepository: DrugRepository,
    private readonly dailyMedService: IDailyMedService,
    private readonly aiConsultationService: IAIConsultationService,
    private readonly cacheService: ICacheService
  ) {}

  async execute(drugName: string): Promise<Drug> {
    // Check if drug exists in DailyMed
    const setId = await this.dailyMedService.checkDrugExists(drugName);
    if (!setId) {
      throw new DrugNotFoundError(drugName);
    }

    // Check if drug already exists in database
    const existingDrug = await this.drugRepository.findByName(drugName);
    if (existingDrug) {
      return existingDrug;
    }

    // Extract drug information from DailyMed
    const extractedDrug = await this.dailyMedService.extractDrugInfo(setId);

    // Validate indications with AI
    const validatedIndications = await this.aiConsultationService.validateIndications(
      extractedDrug.getIndications()
    );

    // Create final drug with validated indications
    const drug = new Drug(
      extractedDrug.getName(),
      extractedDrug.getIdentificationCode(),
      validatedIndications,
      extractedDrug.getDosage()
    );

    // Save to database and cache
    await Promise.all([
      this.drugRepository.save(drug),
      this.cacheService.setDrug(drug)
    ]);

    return drug;
  }
} 