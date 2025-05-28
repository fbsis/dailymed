import { DomainError } from './DomainError';

export class EmptyIdentificationCodeError extends DomainError {
  constructor() {
    super('Identification code cannot be empty');
    this.name = 'EmptyIdentificationCodeError';
  }
} 