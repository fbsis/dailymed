import { InvalidAgeRangeError } from '../errors/InvalidAgeRangeError';

export class AgeRange {
  constructor(
    private readonly minAge: number,
    private readonly maxAge: number | null,
    private readonly unit: 'months' | 'years'
  ) {
    if (minAge < 0) {
      throw InvalidAgeRangeError.negativeAge();
    }
    if (maxAge !== null && maxAge <= minAge) {
      throw InvalidAgeRangeError.invalidRange(minAge, maxAge);
    }
    if (unit === 'months' && minAge > 12) {
      throw InvalidAgeRangeError.invalidMonthsAge(minAge);
    }
  }

  getMinAge(): number {
    return this.minAge;
  }

  getMaxAge(): number | null {
    return this.maxAge;
  }

  getUnit(): 'months' | 'years' {
    return this.unit;
  }

  toString(): string {
    if (this.maxAge === null) {
      return `${this.minAge} ${this.unit} and above`;
    }
    return `${this.minAge} to ${this.maxAge} ${this.unit}`;
  }

  equals(other: AgeRange): boolean {
    return (
      this.minAge === other.minAge &&
      this.maxAge === other.maxAge &&
      this.unit === other.unit
    );
  }
} 