import { AgeRange } from '../value-objects/AgeRange';
import { WeightRange } from '../value-objects/WeightRange';
import { DosageValue } from '../value-objects/DosageValue';
import { DosageNotFoundError } from '../errors/DosageNotFoundError';
import { EmptyDosageListError } from '../errors/EmptyDosageListError';

export class AgeBasedDosage {
  constructor(
    private readonly ageRange: AgeRange,
    private readonly weightBasedDosages: Map<WeightRange, DosageValue>
  ) {
    if (weightBasedDosages.size === 0) {
      throw new EmptyDosageListError();
    }
  }

  getAgeRange(): AgeRange {
    return this.ageRange;
  }

  getDosageForWeight(weight: number): DosageValue {
    for (const [range, dosage] of this.weightBasedDosages) {
      const maxWeight = range.getMaxWeight();
      const minWeight = range.getMinWeight();
      if (weight >= minWeight && (maxWeight === null || weight <= maxWeight)) {
        return dosage;
      }
    }
    throw DosageNotFoundError.forWeight(weight, this.ageRange.toString());
  }

  getAllWeightBasedDosages(): Map<WeightRange, DosageValue> {
    return new Map(this.weightBasedDosages);
  }
} 