import { DomainError } from "../errors/DomainError";
import * as bcrypt from "bcryptjs";

export class InvalidPasswordError extends DomainError {
  constructor(message: string) {
    super(`Invalid password: ${message}`);
  }

  static tooShort(): InvalidPasswordError {
    return new InvalidPasswordError("Password must be at least 6 characters long");
  }
}

export class Password {
  private readonly SALT_ROUNDS = 10;
  private readonly hashedValue: string;

  constructor(value: string, isHashed: boolean = false) {
    if (isHashed) {
      this.hashedValue = value;
    } else {
      this.validate(value);
      this.hashedValue = bcrypt.hashSync(value, this.SALT_ROUNDS);
    }
  }

  private validate(password: string): void {
    if (!password || password.length < 6) {
      throw InvalidPasswordError.tooShort();
    }
  }

  compare(plainPassword: string): boolean {
    return bcrypt.compareSync(plainPassword, this.hashedValue);
  }

  getValue(): string {
    return this.hashedValue;
  }

  equals(other: Password): boolean {
    return this.hashedValue === other.hashedValue;
  }

  static fromHashed(hashedValue: string): Password {
    return new Password(hashedValue, true);
  }
} 