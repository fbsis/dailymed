import { CreateDrugUseCase } from "@/domain/use-cases/CreateDrugUseCase";
import { MongooseDrugRepository } from "@/infra/repositories/mongoose/DrugRepository";
import { RedisCacheService } from "@/infra/cache/RedisCacheService";
import { Drug } from "@/domain/entities/Drug";
import { DrugName } from "@/domain/value-objects/DrugName";
import { DailyMedService } from "@/infra/services/DailyMedService";
import { AIConsultationService } from "@/infra/services/AIConsultationService";

export class DrugCreateController {
  private createDrugUseCase: CreateDrugUseCase;

  constructor() {
    this.createDrugUseCase = new CreateDrugUseCase(
      new MongooseDrugRepository(),
      new DailyMedService(),
      new AIConsultationService(),
      new RedisCacheService()
    );
  }

  async createDrug(name: DrugName): Promise<Drug> {
    console.log("name", name);
    return this.createDrugUseCase.execute(name);
  }
}
