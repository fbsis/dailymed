import { DomainError } from './DomainError';

export class InvalidIndicationCodeError extends DomainError {
  constructor() {
    super('Indication code must be in format X.X');
    this.name = 'InvalidIndicationCodeError';
  }
} 