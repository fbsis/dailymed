export class DrugName {
  constructor(private readonly value: string) {
    this.value = value.trim();
    this.validate(value);
  }

  validate(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Drug name cannot be empty');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: DrugName): boolean {
    return this.value === other.value;
  }
} 