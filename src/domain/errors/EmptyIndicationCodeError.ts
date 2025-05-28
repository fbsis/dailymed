import { DomainError } from './DomainError';

export class EmptyIndicationCodeError extends DomainError {
  constructor() {
    super('Indication code cannot be empty');
    this.name = 'EmptyIndicationCodeError';
  }
} 