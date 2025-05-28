import { DomainError } from './DomainError';

export class ShortConditionError extends DomainError {
  constructor(minLength: number) {
    super(`Condition must be at least ${minLength} characters long`);
    this.name = 'ShortConditionError';
  }
} 