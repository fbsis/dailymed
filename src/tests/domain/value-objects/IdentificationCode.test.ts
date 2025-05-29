import { IdentificationCode } from '@/domain/value-objects/IdentificationCode';
import { InvalidUUIDError } from '@/domain/errors';

describe('IdentificationCode', () => {
  describe('instantiation', () => {
    it('should exist', () => {
      expect(IdentificationCode).toBeDefined();
    });

    it('should be instantiable with valid UUID', () => {
      const identificationCode = new IdentificationCode('123e4567-e89b-12d3-a456-426614174000');
      expect(identificationCode).toBeInstanceOf(IdentificationCode);
    });

    it('should throw InvalidUUIDError for invalid UUID format', () => {
      const invalidUUIDs = [
        '', // Empty string
        '   ', // Whitespace only
        '123e4567-e89b-12d3-a456', // Incomplete UUID
        '123e4567-e89b-12d3-a456-426614174000-extra', // Extra characters
        '123e4567-e89b-12d3-a456-42661417400g', // Invalid character
        'not-a-uuid', // Not a UUID
        '123e4567-e89b-12d3-a456_426614174000', // Wrong separator
      ];

      invalidUUIDs.forEach(invalidUUID => {
        expect(() => new IdentificationCode(invalidUUID)).toThrow(InvalidUUIDError);
      });
    });

    it('should trim whitespace from UUID', () => {
      const identificationCode = new IdentificationCode('  123e4567-e89b-12d3-a456-426614174000  ');
      expect(identificationCode.getValue()).toBe('123e4567-e89b-12d3-a456-426614174000');
    });
  });

  describe('getters', () => {
    it('should return correct UUID value', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const identificationCode = new IdentificationCode(uuid);
      expect(identificationCode.getValue()).toBe(uuid);
    });

    it('should return different instances for same values', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const identificationCode1 = new IdentificationCode(uuid);
      const identificationCode2 = new IdentificationCode(uuid);
      expect(identificationCode1).not.toBe(identificationCode2);
    });
  });

  describe('equals', () => {
    it('should return true for same UUID', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const identificationCode1 = new IdentificationCode(uuid);
      const identificationCode2 = new IdentificationCode(uuid);
      expect(identificationCode1.equals(identificationCode2)).toBe(true);
    });

    it('should return false for different UUIDs', () => {
      const identificationCode1 = new IdentificationCode('123e4567-e89b-12d3-a456-426614174000');
      const identificationCode2 = new IdentificationCode('987fcdeb-51a2-43d7-b654-987654321000');
      expect(identificationCode1.equals(identificationCode2)).toBe(false);
    });

    it('should be case insensitive', () => {
      const identificationCode1 = new IdentificationCode('123e4567-e89b-12d3-a456-426614174000');
      const identificationCode2 = new IdentificationCode('123E4567-E89B-12D3-A456-426614174000');
      expect(identificationCode1.equals(identificationCode2)).toBe(true);
    });
  });

  describe('UUID validation', () => {
    it('should handle version 1 UUIDs', () => {
      expect(() => new IdentificationCode('123e4567-e89b-12d3-a456-426614174000')).not.toThrow();
    });

    it('should handle version 4 UUIDs', () => {
      expect(() => new IdentificationCode('550e8400-e29b-41d4-a716-446655440000')).not.toThrow();
    });

    it('should handle UUIDs with all zeros', () => {
      expect(() => new IdentificationCode('00000000-0000-0000-0000-000000000000')).not.toThrow();
    });

    it('should handle UUIDs with all ones', () => {
      expect(() => new IdentificationCode('ffffffff-ffff-ffff-ffff-ffffffffffff')).not.toThrow();
    });

    it('should reject malformed UUIDs', () => {
      // Missing hyphens
      expect(() => new IdentificationCode('123e4567e89b12d3a456426614174000')).toThrow(InvalidUUIDError);
      // Wrong number of characters
      expect(() => new IdentificationCode('123e4567-e89b-12d3-a456-42661417400')).toThrow(InvalidUUIDError);
      // Invalid characters
      expect(() => new IdentificationCode('123e4567-e89b-12d3-a456-42661417400g')).toThrow(InvalidUUIDError);
      // Wrong separator
      expect(() => new IdentificationCode('123e4567_e89b_12d3_a456_426614174000')).toThrow(InvalidUUIDError);
    });
  });
}); 