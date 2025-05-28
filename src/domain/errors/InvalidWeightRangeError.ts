import { DomainError } from './DomainError';

export class InvalidWeightRangeError extends DomainError {
  constructor(message: string) {
    super(`Invalid weight range: ${message}`);
  }

  static nonPositiveWeight(weight: number): InvalidWeightRangeError {
    return new InvalidWeightRangeError(`Weight (${weight}) must be greater than 0`);
  }

  static invalidRange(minWeight: number, maxWeight: number): InvalidWeightRangeError {
    return new InvalidWeightRangeError(`Maximum weight (${maxWeight}) must be greater than minimum weight (${minWeight})`);
  }
} 