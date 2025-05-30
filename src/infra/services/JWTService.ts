import * as jwt from "jsonwebtoken";
import { UserRoleType } from "@/domain/value-objects/UserRole";

interface TokenPayload {
  id: string;
  email: string;
  role: UserRoleType;
}

export class JWTService {
  private readonly JWT_SECRET: string;
  private readonly TOKEN_EXPIRATION = "24h";

  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET environment variable is not set");
    }
    this.JWT_SECRET = secret;
  }

  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.TOKEN_EXPIRATION,
    });
  }

  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.JWT_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
} 