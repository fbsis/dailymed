import { Email, InvalidEmailError } from '@/domain/value-objects/Email';

describe('Email Value Object', () => {
  it('should create a valid email', () => {
    const email = new Email('test@example.com');
    expect(email.getValue()).toBe('test@example.com');
  });

  it('should throw InvalidEmailError for invalid email format', () => {
    const invalidEmails = [
      'test',
      'test@',
      '@example.com',
      'test@example',
      'test@.com',
      'test.example.com',
      '',
      ' ',
    ];

    invalidEmails.forEach(invalidEmail => {
      expect(() => new Email(invalidEmail)).toThrow(InvalidEmailError);
    });
  });

  it('should consider equal emails as equal', () => {
    const email1 = new Email('test@example.com');
    const email2 = new Email('TEST@EXAMPLE.COM');
    const email3 = new Email('other@example.com');

    expect(email1.equals(email2)).toBe(true);
    expect(email1.equals(email3)).toBe(false);
  });
}); 