import { UserAlreadyExistsError } from '@/domain/errors/UserAlreadyExistsError';
import { DomainError } from '@/domain/errors/DomainError';

describe('UserAlreadyExistsError', () => {
  it('should be an instance of DomainError', () => {
    const error = new UserAlreadyExistsError('test@example.com');
    expect(error).toBeInstanceOf(DomainError);
  });

  it('should include the email in the error message', () => {
    const email = 'test@example.com';
    const error = new UserAlreadyExistsError(email);
    expect(error.message).toBe(`User with email ${email} already registered`);
  });

  it('should have the correct name', () => {
    const error = new UserAlreadyExistsError('test@example.com');
    expect(error.name).toBe('UserAlreadyExistsError');
  });

  it('should handle different email addresses', () => {
    const emails = [
      'user1@example.com',
      'admin@domain.com',
      'test.user@sub.domain.com'
    ];

    emails.forEach(email => {
      const error = new UserAlreadyExistsError(email);
      expect(error.message).toBe(`User with email ${email} already registered`);
    });
  });
}); 