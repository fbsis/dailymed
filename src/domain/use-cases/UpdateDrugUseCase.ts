import { Drug } from '../entities/Drug';
import { DrugRepository } from '../repositories/DrugRepository';
import { IDailyMedService } from '../protocols/IDailyMedService';
import { IAIConsultationService } from '../protocols/IAIConsultationService';
import { ICacheService } from '../protocols/ICacheService';
import { DrugNotFoundError } from '../errors/DrugNotFoundError';

export class UpdateDrugUseCase {
  constructor(
    private readonly drugRepository: DrugRepository,
    private readonly dailyMedService: IDailyMedService,
    private readonly aiConsultationService: IAIConsultationService,
    private readonly cacheService: ICacheService
  ) {}

  async execute(drugName: string): Promise<Drug> {
    // Check if drug exists in database
    const existingDrug = await this.drugRepository.findByName(drugName);
    if (!existingDrug) {
      throw new DrugNotFoundError(drugName);
    }

    // Check if drug exists in DailyMed
    const setId = await this.dailyMedService.checkDrugExists(drugName);
    if (!setId) {
      throw new DrugNotFoundError(drugName);
    }

    // Extract updated drug information from DailyMed
    const extractedDrug = await this.dailyMedService.extractDrugInfo(setId);

    // Validate indications with AI
    const validatedIndications = await this.aiConsultationService.validateIndications(
      extractedDrug.getIndications()
    );

    // Create updated drug with validated indications
    const updatedDrug = new Drug(
      extractedDrug.getName(),
      extractedDrug.getIdentificationCode(),
      validatedIndications,
      extractedDrug.getDosage()
    );

    // Update in database and cache
    await Promise.all([
      this.drugRepository.update(updatedDrug),
      this.cacheService.setDrug(updatedDrug)
    ]);

    return updatedDrug;
  }
} 