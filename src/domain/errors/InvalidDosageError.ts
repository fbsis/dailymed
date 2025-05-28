import { DomainError } from './DomainError';

export class InvalidDosageError extends DomainError {
  constructor(message: string) {
    super(`Invalid dosage: ${message}`);
  }

  static emptyDosage(): InvalidDosageError {
    return new InvalidDosageError('Dosage value cannot be empty');
  }

  static missingUnit(dosage: string): InvalidDosageError {
    return new InvalidDosageError(`Dosage value (${dosage}) must include unit (mg or g)`);
  }
} 