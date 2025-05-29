import { AgeBasedDosage } from '@/domain/entities/AgeBasedDosage';
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
    // Sort dosages by age range to ensure consistent behavior at boundaries
    const sortedDosages = [...this.ageBasedDosages].sort((a, b) => {
      const rangeA = a.getAgeRange();
      const rangeB = b.getAgeRange();
      if (!rangeA || !rangeB) return 0;
      
      // Put ranges with null maxAge at the end
      if (rangeA.getMaxAge() === null && rangeB.getMaxAge() !== null) return 1;
      if (rangeA.getMaxAge() !== null && rangeB.getMaxAge() === null) return -1;
      
      return rangeA.getMinAge() - rangeB.getMinAge();
    });

    for (const dosage of sortedDosages) {
      const ageRange = dosage.getAgeRange();
      if (!ageRange) continue;

      const maxAge = ageRange.getMaxAge();
      if (ageUnit === ageRange.getUnit() && 
          age >= ageRange.getMinAge() && 
          (maxAge === null ? age >= ageRange.getMinAge() : age < maxAge)) {
        return dosage;
      }
    }

    // Check if age matches the max age of the last range with a max age
    const lastDosage = sortedDosages[sortedDosages.length - 1];
    const lastRange = lastDosage.getAgeRange();
    if (lastRange && 
        ageUnit === lastRange.getUnit() && 
        lastRange.getMaxAge() !== null && 
        age === lastRange.getMaxAge()) {
      return lastDosage;
    }

    throw DosageNotFoundError.forAgeAndWeight(age, ageUnit, weight);
  }

  getAllAgeBasedDosages(): AgeBasedDosage[] {
    return [...this.ageBasedDosages];
  }
} 