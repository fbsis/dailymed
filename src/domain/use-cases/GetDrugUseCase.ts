import { Drug } from '../entities/Drug';
import { DrugRepository } from '../repositories/DrugRepository';
import { ICacheService } from '../protocols/ICacheService';
import { DrugNotFoundError } from '../errors/DrugNotFoundError';

export class GetDrugUseCase {
  constructor(
    private readonly drugRepository: DrugRepository,
    private readonly cacheService: ICacheService
  ) {}

  async execute(drugName: string): Promise<Drug> {
    // Try to get from cache first
    const cachedDrug = await this.cacheService.getDrug(drugName);
    if (cachedDrug) {
      return cachedDrug;
    }

    // If not in cache, get from database
    const drug = await this.drugRepository.findByName(drugName);
    if (!drug) {
      throw new DrugNotFoundError(drugName);
    }

    // Store in cache for future requests
    await this.cacheService.setDrug(drug);

    return drug;
  }
} 