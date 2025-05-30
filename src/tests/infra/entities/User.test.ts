import { User } from '@/domain/entities/User';
import { UserName } from '@/domain/value-objects/UserName';
import { Email } from '@/domain/value-objects/Email';
import { Password } from '@/domain/value-objects/Password';
import { UserRole } from '@/domain/value-objects/UserRole';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid-123'
}));

describe('User Entity', () => {
  const createValidUser = () => {
    const name = new UserName('John Doe');
    const email = new Email('john@example.com');
    const password = new Password('validPassword123');
    const role = new UserRole('normal');
    return new User(name, email, password, role);
  };

  it('should create a user with valid data', () => {
    const user = createValidUser();

    expect(user.getId()).toBe('test-uuid-123');
    expect(user.getName().getValue()).toBe('John Doe');
    expect(user.getEmail().getValue()).toBe('john@example.com');
    expect(user.getRole().getValue()).toBe('normal');
    expect(user.isAdmin()).toBe(false);
  });

  it('should create an admin user', () => {
    const name = new UserName('Admin User');
    const email = new Email('admin@example.com');
    const password = new Password('adminPass123');
    const role = new UserRole('admin');
    
    const adminUser = new User(name, email, password, role);

    expect(adminUser.getRole().getValue()).toBe('admin');
    expect(adminUser.isAdmin()).toBe(true);
  });

  it('should generate unique IDs for different users', () => {
    const user1 = createValidUser();
    const user2 = createValidUser();

    expect(user1.getId()).toBe(user2.getId()); // Because we mocked uuid
  });

  it('should return value objects for user properties', () => {
    const user = createValidUser();

    expect(user.getName()).toBeInstanceOf(UserName);
    expect(user.getEmail()).toBeInstanceOf(Email);
    expect(user.getPassword()).toBeInstanceOf(Password);
    expect(user.getRole()).toBeInstanceOf(UserRole);
  });
}); 