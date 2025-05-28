import { DomainError } from './DomainError';

export class EmptyDescriptionError extends DomainError {
  constructor() {
    super('Description cannot be empty');
    this.name = 'EmptyDescriptionError';
  }
} 