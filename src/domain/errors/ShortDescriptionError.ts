import { DomainError } from './DomainError';

export class ShortDescriptionError extends DomainError {
  constructor(minLength: number) {
    super(`Description must be at least ${minLength} characters long`);
    this.name = 'ShortDescriptionError';
  }
} 