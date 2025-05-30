import { UserName, EmptyUserNameError } from '@/domain/value-objects/UserName';

describe('UserName Value Object', () => {
  it('should create a valid user name', () => {
    const name = new UserName('John Doe');
    expect(name.getValue()).toBe('John Doe');
  });

  it('should trim whitespace', () => {
    const name = new UserName('  John Doe  ');
    expect(name.getValue()).toBe('John Doe');
  });

  it('should throw EmptyUserNameError for empty or whitespace-only names', () => {
    const invalidNames = ['', ' ', '   ', '\t', '\n'];
    invalidNames.forEach(invalidName => {
      expect(() => new UserName(invalidName)).toThrow(EmptyUserNameError);
    });
  });

  it('should consider equal names as equal', () => {
    const name1 = new UserName('John Doe');
    const name2 = new UserName('John Doe');
    const name3 = new UserName('Jane Doe');

    expect(name1.equals(name2)).toBe(true);
    expect(name1.equals(name3)).toBe(false);
  });

  it('should handle names with special characters', () => {
    const specialNames = [
      'João Silva',
      'Maria-José',
      'O\'Connor',
      'Jean-Pierre',
      'François',
    ];

    specialNames.forEach(specialName => {
      const name = new UserName(specialName);
      expect(name.getValue()).toBe(specialName);
    });
  });
}); 