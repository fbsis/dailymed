import { InvalidDosageError } from '../errors/InvalidDosageError';

export class DosageValue {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw InvalidDosageError.emptyDosage();
    }
    if (!value.includes('mg') && !value.includes('g')) {
      throw InvalidDosageError.missingUnit(value);
    }
    this.value = value.trim();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: DosageValue): boolean {
    return this.value === other.value;
  }
} 