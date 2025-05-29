import { DrugRepository } from '../repositories/DrugRepository';
import { ICacheService } from '../protocols/ICacheService';
import { DrugNotFoundError } from '../errors/DrugNotFoundError';

export class DeleteDrugUseCase {
  constructor(
    private readonly drugRepository: DrugRepository,
    private readonly cacheService: ICacheService
  ) {}

  async execute(drugName: string): Promise<void> {
    // Check if drug exists in database
    const existingDrug = await this.drugRepository.findByName(drugName);
    if (!existingDrug) {
      throw new DrugNotFoundError(drugName);
    }

    // Delete from database and cache
    await Promise.all([
      this.drugRepository.delete(drugName),
      this.cacheService.removeDrug(drugName)
    ]);
  }
} 