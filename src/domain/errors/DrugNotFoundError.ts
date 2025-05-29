import { DomainError } from './DomainError';

export class DrugNotFoundError extends DomainError {
  constructor(drugName: string) {
    super(`Drug not found: ${drugName}`);
    this.name = 'DrugNotFoundError';
  }
} 