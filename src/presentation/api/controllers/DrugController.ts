import { DrugRepository } from "@/domain/repositories/DrugRepository";
import { Drug } from "@/domain/entities/Drug";
import { DrugName } from "@/domain/value-objects/DrugName";
import { IdentificationCode } from "@/domain/value-objects/IdentificationCode";
import { Indication } from "@/domain/entities/Indication";
import { IndicationCode } from "@/domain/value-objects/IndicationCode";
import { Condition } from "@/domain/value-objects/Condition";
import { Description } from "@/domain/value-objects/Description";
import { Dosage } from "@/domain/entities/Dosage";
import { AgeGroups } from "@/domain/entities/AgeGroups";
import { AgeBasedDosage } from "@/domain/entities/AgeBasedDosage";
import { AgeRange } from "@/domain/value-objects/AgeRange";
import { WeightRange } from "@/domain/value-objects/WeightRange";
import { DosageValue } from "@/domain/value-objects/DosageValue";

export class DrugController {
  constructor(private readonly drugRepository: DrugRepository) {}

  async findAll(): Promise<Drug[]> {
    return this.drugRepository.findAll();
  }

  async findByName(name: string): Promise<Drug | null> {
    return this.drugRepository.findByName(name);
  }

  async save(drugData: any): Promise<void> {
    const name = new DrugName(drugData.name);
    const identificationCode = new IdentificationCode(
      drugData.identificationCode
    );
    const indications = drugData.indications.map(
      (ind: any) =>
        new Indication(
          new IndicationCode(ind.code),
          new Condition(ind.description),
          new Description(ind.description)
        )
    );

    const ageRange = new AgeRange(0, 12, "years");
    const weightRange = new WeightRange(1, 12, "kg");
    const dosageValue = new DosageValue(drugData.dosage.value);
    const weightBasedDosages = new Map([[weightRange, dosageValue]]);
    const ageBasedDosage = new AgeBasedDosage(ageRange, weightBasedDosages);
    const ageGroups = new AgeGroups([ageBasedDosage]);

    const instructions = [new Description(drugData.dosage.value)];
    const dosage = new Dosage(instructions, ageGroups);

    const drug = new Drug(name, identificationCode, indications, dosage);
    await this.drugRepository.save(drug);
  }

  async update(drugData: any): Promise<void> {
    const name = new DrugName(drugData.name);
    const identificationCode = new IdentificationCode(
      drugData.identificationCode
    );
    const indications = drugData.indications.map(
      (ind: any) =>
        new Indication(
          new IndicationCode(ind.code),
          new Condition(ind.description),
          new Description(ind.description)
        )
    );

    const ageRange = new AgeRange(0, 12, "years");
    const weightRange = new WeightRange(1, 12, "kg");
    const dosageValue = new DosageValue(drugData.dosage.value);
    const weightBasedDosages = new Map([[weightRange, dosageValue]]);
    const ageBasedDosage = new AgeBasedDosage(ageRange, weightBasedDosages);
    const ageGroups = new AgeGroups([ageBasedDosage]);

    const instructions = [new Description(drugData.dosage.value)];
    const dosage = new Dosage(instructions, ageGroups);

    const drug = new Drug(name, identificationCode, indications, dosage);
    await this.drugRepository.update(drug);
  }

  async delete(name: string): Promise<void> {
    await this.drugRepository.delete(name);
  }
}
