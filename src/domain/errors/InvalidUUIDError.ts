import { DomainError } from './DomainError';

export class InvalidUUIDError extends DomainError {
  constructor() {
    super('Identification code must be a valid UUID (e.g., 595f437d-2729-40bb-9c62-c8ece1f82780)');
    this.name = 'InvalidUUIDError';
  }
} 