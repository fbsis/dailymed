import { UserRepository } from '@/domain/repositories/UserRepository';
import { User } from '@/domain/entities/User';
import { UserName } from '@/domain/value-objects/UserName';
import { InvalidCredentialsError } from '@/domain/errors/InvalidCredentialsError';
import { UserAlreadyExistsError } from '@/domain/errors/UserAlreadyExistsError';
import { Email } from '@/domain/value-objects/Email';
import { Password } from '@/domain/value-objects/Password';
import { JWTService } from './JWTService';
import { UserRole } from '@/domain/value-objects/UserRole';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'normal';
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JWTService
  ) {}

  async register(data: RegisterData): Promise<AuthResponse> {
    const { name, email, password, role } = data;

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new UserAlreadyExistsError(email);
    }

    // Create user entity
    const user = new User(
      new UserName(name),
      new Email(email),
      new Password(password),
      new UserRole(role)
    );

    // Save user
    await this.userRepository.save(user);

    // Generate JWT token
    const token = this.jwtService.generateToken({
      id: user.getId(),
      email: user.getEmail().getValue(),
      role: user.getRole().getValue(),
    });

    return {
      token,
      user: {
        name: user.getName().getValue(),
        email: user.getEmail().getValue(),
        role: user.getRole().getValue(),
      },
    };
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const { email, password } = data;

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    // Verify password
    if (!user.getPassword().compare(password)) {
      throw new InvalidCredentialsError();
    }

    // Generate JWT token
    const token = this.jwtService.generateToken({
      id: user.getId(),
      email: user.getEmail().getValue(),
      role: user.getRole().getValue(),
    });

    return {
      token,
      user: {
        name: user.getName().getValue(),
        email: user.getEmail().getValue(),
        role: user.getRole().getValue(),
      },
    };
  }

  verifyToken(token: string) {
    return this.jwtService.verifyToken(token);
  }
} 