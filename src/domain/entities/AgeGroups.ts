import { AgeBasedDosage } from './AgeBasedDosage';
import { DosageNotFoundError } from '../errors/DosageNotFoundError';
import { EmptyDosageListError } from '../errors/EmptyDosageListError';

export class AgeGroups {
  constructor(
    private readonly ageBasedDosages: AgeBasedDosage[]
  ) {
    if (ageBasedDosages.length === 0) {
      throw new EmptyDosageListError();
    }
  }

  getDosageForAgeAndWeight(age: number, ageUnit: 'months' | 'years', weight: number): AgeBasedDosage {
    for (const dosage of this.ageBasedDosages) {
      const ageRange = dosage.getAgeRange();
      if (ageRange && ageUnit === ageRange.getUnit() && age >= ageRange.getMinAge()) {
        return dosage;
      }
    }
    throw DosageNotFoundError.forAgeAndWeight(age, ageUnit, weight);
  }

  getAllAgeBasedDosages(): AgeBasedDosage[] {
    return [...this.ageBasedDosages];
  }
} 