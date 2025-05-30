import { DomainError } from "../errors/DomainError";

export class InvalidEmailError extends DomainError {
  constructor(email: string) {
    super(`Invalid email format: ${email}`);
  }
}

export class Email {
  private static readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(private readonly value: string) {
    this.value = value.trim().toLowerCase();
    this.validate(value);
  }

  private validate(email: string): void {
    if (!Email.EMAIL_REGEX.test(email)) {
      throw new InvalidEmailError(email);
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
} 