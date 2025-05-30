import mongoose from 'mongoose';
import { UserModel, UserRole } from '@/infra/models/UserModel';

describe('UserModel', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  it('should create a user with valid data', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedPassword123',
      role: UserRole.NORMAL
    };

    const user = await UserModel.create(userData);

    expect(user).toBeDefined();
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email.toLowerCase());
    expect(user.password).toBe(userData.password);
    expect(user.role).toBe(userData.role);
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
  });

  it('should trim and lowercase email', async () => {
    const userData = {
      name: 'John Doe',
      email: ' JOHN@EXAMPLE.com ',
      password: 'hashedPassword123',
      role: UserRole.NORMAL
    };

    const user = await UserModel.create(userData);
    expect(user.email).toBe('john@example.com');
  });

  it('should trim name', async () => {
    const userData = {
      name: '  John Doe  ',
      email: 'john@example.com',
      password: 'hashedPassword123',
      role: UserRole.NORMAL
    };

    const user = await UserModel.create(userData);
    expect(user.name).toBe('John Doe');
  });

  it('should set default role to NORMAL', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedPassword123'
    };

    const user = await UserModel.create(userData);
    expect(user.role).toBe(UserRole.NORMAL);
  });

  it('should not allow duplicate emails', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedPassword123',
      role: UserRole.NORMAL
    };

    await UserModel.create(userData);

    await expect(UserModel.create(userData)).rejects.toThrow();
  });

  it('should validate required fields', async () => {
    const invalidUsers = [
      { email: 'john@example.com', password: 'hashedPassword123' }, // missing name
      { name: 'John Doe', password: 'hashedPassword123' }, // missing email
      { name: 'John Doe', email: 'john@example.com' } // missing password
    ];

    for (const invalidUser of invalidUsers) {
      await expect(UserModel.create(invalidUser)).rejects.toThrow();
    }
  });

  it('should validate role enum values', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedPassword123',
      role: 'invalid_role' as UserRole
    };

    await expect(UserModel.create(userData)).rejects.toThrow();
  });

  it('should update timestamps on save', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedPassword123',
      role: UserRole.NORMAL
    };

    const user = await UserModel.create(userData);
    const createdAt = user.createdAt;
    const updatedAt = user.updatedAt;

    // Wait a bit to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 1000));

    user.name = 'Jane Doe';
    await user.save();

    expect(user.createdAt).toEqual(createdAt);
    expect(user.updatedAt.getTime()).toBeGreaterThan(updatedAt.getTime());
  });
}); 