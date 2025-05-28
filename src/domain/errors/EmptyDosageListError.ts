import { DomainError } from './DomainError';

export class EmptyDosageListError extends DomainError {
  constructor() {
    super('At least one weight-based dosage must be provided');
  }
} 