import { EmptyIdentificationCodeError, InvalidUUIDError } from '@/domain/errors';

export class IdentificationCode {
  private static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  constructor(private readonly value: string) {
    this.validate(value);
  }

  validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new EmptyIdentificationCodeError();
    }

    const trimmedValue = value.trim();
    if (!IdentificationCode.UUID_REGEX.test(trimmedValue)) {
      throw new InvalidUUIDError();
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: IdentificationCode): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }

  static create(value: string): IdentificationCode {
    return new IdentificationCode(value);
  }
}