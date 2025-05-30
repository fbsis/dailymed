import { DomainError } from "../errors/DomainError";

export class EmptyUserNameError extends DomainError {
  constructor() {
    super("User name cannot be empty");
  }
}

export class UserName {
  constructor(private readonly value: string) {
    this.value = value.trim();
    this.validate(value);
  }

  private validate(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new EmptyUserNameError();
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UserName): boolean {
    return this.value === other.value;
  }
} 