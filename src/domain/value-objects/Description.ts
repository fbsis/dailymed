export class Description {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Description cannot be empty');
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