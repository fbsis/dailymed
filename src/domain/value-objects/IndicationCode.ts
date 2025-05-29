export class IndicationCode {
  constructor(private readonly value: string) {
    this.validate(value);
  }

  validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Indication code cannot be empty');
    }
    if (!/^\d+\.\d+$/.test(value)) {
      throw new Error('Indication code must be in format X.X');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: IndicationCode): boolean {
    return this.value === other.value;
  }
} 