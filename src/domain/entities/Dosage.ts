import { Description } from '../value-objects/Description';
import { AgeGroups } from './AgeGroups';

export class Dosage {
  constructor(
    private readonly importantAdministrationInstructions: Description[],
    private readonly ageGroups: AgeGroups
  ) {}

  getImportantAdministrationInstructions(): Description[] {
    return this.importantAdministrationInstructions;
  }

  getAgeGroups(): AgeGroups {
    return this.ageGroups;
  }
} 