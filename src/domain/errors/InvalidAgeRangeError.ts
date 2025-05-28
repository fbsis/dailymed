import { DomainError } from './DomainError';

export class InvalidAgeRangeError extends DomainError {
  constructor(message: string) {
    super(`Invalid age range: ${message}`);
  }

  static negativeAge(): InvalidAgeRangeError {
    return new InvalidAgeRangeError('Age cannot be negative');
  }

  static invalidRange(minAge: number, maxAge: number): InvalidAgeRangeError {
    return new InvalidAgeRangeError(`Maximum age (${maxAge}) must be greater than minimum age (${minAge})`);
  }

  static invalidMonthsAge(age: number): InvalidAgeRangeError {
    return new InvalidAgeRangeError(`Age in months (${age}) cannot be greater than 12`);
  }
} 