import { DomainError } from './DomainError';

export class DosageNotFoundError extends DomainError {
  constructor(message: string) {
    super(`Dosage not found: ${message}`);
  }

  static forAgeAndWeight(age: number, ageUnit: string, weight: number): DosageNotFoundError {
    return new DosageNotFoundError(`No dosage found for age ${age} ${ageUnit} and weight ${weight} kg`);
  }

  static forWeight(weight: number, ageRange: string): DosageNotFoundError {
    return new DosageNotFoundError(`No dosage found for weight ${weight} kg in age range ${ageRange}`);
  }
} 