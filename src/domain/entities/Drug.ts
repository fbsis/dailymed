import { Indication } from '@/domain/entities/Indication';
import { Dosage } from '@/domain/entities/Dosage';
import { DrugName } from '@/domain/value-objects/DrugName';
import { IdentificationCode } from '@/domain/value-objects/IdentificationCode';

export class Drug {
  constructor(
    private readonly name: DrugName,
    private readonly identificationCode: IdentificationCode,
    private readonly indications: Indication[],
    private readonly dosage: Dosage
  ) {}

  getName(): DrugName {
    return this.name;
  }

  getIdentificationCode(): IdentificationCode {
    return this.identificationCode; 
  }

  getIndications(): Indication[] {
    return this.indications;
  }

  getDosage(): Dosage {
    return this.dosage;
  }
} 