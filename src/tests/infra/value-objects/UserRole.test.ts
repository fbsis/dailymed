import { UserRole, InvalidUserRoleError } from '@/domain/value-objects/UserRole';

describe('UserRole Value Object', () => {
  it('should create a valid admin role', () => {
    const role = new UserRole('admin');
    expect(role.getValue()).toBe('admin');
    expect(role.isAdmin()).toBe(true);
  });

  it('should create a valid normal role', () => {
    const role = new UserRole('normal');
    expect(role.getValue()).toBe('normal');
    expect(role.isAdmin()).toBe(false);
  });

  it('should throw InvalidUserRoleError for invalid roles', () => {
    const invalidRoles = [
      '',
      ' ',
      'ADMIN',
      'NORMAL',
      'superuser',
      'guest',
      'moderator',
    ];

    invalidRoles.forEach(invalidRole => {
      expect(() => new UserRole(invalidRole as any)).toThrow(InvalidUserRoleError);
    });
  });

  it('should consider equal roles as equal', () => {
    const role1 = new UserRole('admin');
    const role2 = new UserRole('admin');
    const role3 = new UserRole('normal');

    expect(role1.equals(role2)).toBe(true);
    expect(role1.equals(role3)).toBe(false);
  });

  it('should correctly identify admin role', () => {
    const adminRole = new UserRole('admin');
    const normalRole = new UserRole('normal');

    expect(adminRole.isAdmin()).toBe(true);
    expect(normalRole.isAdmin()).toBe(false);
  });
}); 