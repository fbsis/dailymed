import { DosageValue } from '../value-objects/DosageValue';

export class WeightBasedDosage {
  constructor(
    private readonly initialLoadingDose: DosageValue,
    private readonly subsequentDosage: DosageValue
  ) {}

  getInitialLoadingDose(): DosageValue {
    return this.initialLoadingDose;
  }

  getSubsequentDosage(): DosageValue {
    return this.subsequentDosage;
  }
} 