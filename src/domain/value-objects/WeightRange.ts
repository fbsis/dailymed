import { InvalidWeightRangeError } from '../errors/InvalidWeightRangeError';

export class WeightRange {
  constructor(
    private readonly minWeight: number,
    private readonly maxWeight: number | null,
    private readonly unit: 'kg'
  ) {
    if (minWeight <= 0) {
      throw InvalidWeightRangeError.nonPositiveWeight(minWeight);
    }
    if (maxWeight !== null && maxWeight <= minWeight) {
      throw InvalidWeightRangeError.invalidRange(minWeight, maxWeight);
    }
  }

  getMinWeight(): number {
    return this.minWeight;
  }

  getMaxWeight(): number | null {
    return this.maxWeight;
  }

  getUnit(): 'kg' {
    return this.unit;
  }

  toString(): string {
    if (this.maxWeight === null) {
      return `${this.minWeight} ${this.unit} and above`;
    }
    return `${this.minWeight} to ${this.maxWeight} ${this.unit}`;
  }

  equals(other: WeightRange): boolean {
    return (
      this.minWeight === other.minWeight &&
      this.maxWeight === other.maxWeight &&
      this.unit === other.unit
    );
  }
} 