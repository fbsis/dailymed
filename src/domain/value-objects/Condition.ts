import { EmptyConditionError, ShortConditionError } from '@/domain/errors';

export class Condition {
  constructor(private readonly value: string) {
    this.value = value.trim();
    this.validate(value);
  }

  validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new EmptyConditionError();
    }
    if (value.length < 3) {
      throw new ShortConditionError(3);
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Condition): boolean {
    return this.value === other.value;
  }
} 