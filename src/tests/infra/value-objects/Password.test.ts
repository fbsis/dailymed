import { Password, InvalidPasswordError } from '@/domain/value-objects/Password';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  hashSync: jest.fn((value) => `hashed_${value}`),
  compareSync: jest.fn((plain, hashed) => hashed === `hashed_${plain}`),
}));

describe('Password Value Object', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a valid password', () => {
    const password = new Password('validPassword123');
    expect(password.getValue()).toBe('hashed_validPassword123');
    expect(bcrypt.hashSync).toHaveBeenCalledWith('validPassword123', 10);
  });

  it('should throw InvalidPasswordError for short password', () => {
    const shortPasswords = ['', '12345', ' '];
    shortPasswords.forEach(shortPassword => {
      expect(() => new Password(shortPassword)).toThrow(InvalidPasswordError);
    });
  });

  it('should create password from hashed value', () => {
    const hashedPassword = 'hashed_existingPassword';
    const password = Password.fromHashed(hashedPassword);
    expect(password.getValue()).toBe(hashedPassword);
    expect(bcrypt.hashSync).not.toHaveBeenCalled();
  });

  it('should compare passwords correctly', () => {
    const password = new Password('testPassword');
    
    // Test correct password
    expect(password.compare('testPassword')).toBe(true);
    expect(bcrypt.compareSync).toHaveBeenCalledWith('testPassword', 'hashed_testPassword');

    // Test incorrect password
    expect(password.compare('wrongPassword')).toBe(false);
    expect(bcrypt.compareSync).toHaveBeenCalledWith('wrongPassword', 'hashed_testPassword');
  });

  it('should consider equal passwords as equal', () => {
    const password1 = new Password('testPassword');
    const password2 = Password.fromHashed('hashed_testPassword');
    const password3 = new Password('differentPassword');

    expect(password1.equals(password2)).toBe(true);
    expect(password1.equals(password3)).toBe(false);
  });
}); 