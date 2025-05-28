import { DomainError } from './DomainError';

export class EmptyDrugNameError extends DomainError {
  constructor() {
    super('Drug name cannot be empty');
    this.name = 'EmptyDrugNameError';
  }
} 