import { DomainError } from "../errors/DomainError";

export class InvalidUserRoleError extends DomainError {
  constructor(role: string) {
    super(`Invalid user role: ${role}. Role must be either 'admin' or 'normal'`);
  }
}

export type UserRoleType = "admin" | "normal";

export class UserRole {
  private static readonly VALID_ROLES: UserRoleType[] = ["admin", "normal"];

  constructor(private readonly value: UserRoleType) {
    this.validate(value);
  }

  private validate(role: string): void {
    if (!UserRole.VALID_ROLES.includes(role as UserRoleType)) {
      throw new InvalidUserRoleError(role);
    }
  }

  getValue(): UserRoleType {
    return this.value;
  }

  equals(other: UserRole): boolean {
    return this.value === other.value;
  }

  isAdmin(): boolean {
    return this.value === "admin";
  }
} 