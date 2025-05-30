import { UserName } from "@/domain/value-objects/UserName";
import { Email } from "@/domain/value-objects/Email";
import { Password } from "@/domain/value-objects/Password";
import { UserRole } from "@/domain/value-objects/UserRole";
import { v4 as uuidv4 } from "uuid";

export class User {
  private readonly id: string;

  constructor(
    private readonly name: UserName,
    private readonly email: Email,
    private readonly password: Password,
    private readonly role: UserRole
  ) {
    this.id = uuidv4();
  }

  getId(): string {
    return this.id;
  }

  getName(): UserName {
    return this.name;
  }

  getEmail(): Email {
    return this.email;
  }

  getPassword(): Password {
    return this.password;
  }

  getRole(): UserRole {
    return this.role;
  }

  isAdmin(): boolean {
    return this.role.isAdmin();
  }
} 