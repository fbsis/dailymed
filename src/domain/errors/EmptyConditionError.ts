import { DomainError } from './DomainError';

export class EmptyConditionError extends DomainError {
  constructor() {
    super('Condition cannot be empty');
    this.name = 'EmptyConditionError';
  }
} 