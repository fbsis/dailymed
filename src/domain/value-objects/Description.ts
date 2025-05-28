export class Description {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Description cannot be empty');
    }
    if (value.length < 10) {
      throw new Error('Description must be at least 10 characters long');
    }
    this.value = value.trim();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Description): boolean {
    return this.value === other.value;
  }
} 