import { DosageValue } from '../value-objects/DosageValue';

export class PediatricDosage {
  constructor(
    private readonly dosage: DosageValue
  ) {}

  getDosage(): DosageValue {
    return this.dosage;
  }
} 