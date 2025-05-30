import { InvalidCredentialsError } from '@/domain/errors/InvalidCredentialsError';
import { DomainError } from '@/domain/errors/DomainError';

describe('InvalidCredentialsError', () => {
  it('should be an instance of DomainError', () => {
    const error = new InvalidCredentialsError();
    expect(error).toBeInstanceOf(DomainError);
  });

  it('should have the correct error message', () => {
    const error = new InvalidCredentialsError();
    expect(error.message).toBe('Invalid email or password');
  });

  it('should have the correct name', () => {
    const error = new InvalidCredentialsError();
    expect(error.name).toBe('InvalidCredentialsError');
  });
}); 