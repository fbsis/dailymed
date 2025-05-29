import { IdentificationCode } from '@/domain/value-objects/IdentificationCode';
import { InvalidUUIDError } from '@/domain/errors/InvalidUUIDError';

describe('IdentificationCode', () => {
  describe('instantiation', () => {
    it('should exist', () => {
      expect(IdentificationCode).toBeDefined();
    });
  });

  describe('getters', () => {
    it('should return the correct UUID value', () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      const identificationCode = new IdentificationCode(validUUID);
      expect(identificationCode.getValue()).toBe(validUUID);
    });

    it('should return different instances for same UUID', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const code1 = new IdentificationCode(uuid);
      const code2 = new IdentificationCode(uuid);
      expect(code1).not.toBe(code2);
    });
  });

  describe('equals', () => {
    it('should return true for same UUID', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const code1 = new IdentificationCode(uuid);
      const code2 = new IdentificationCode(uuid);
      expect(code1.equals(code2)).toBe(true);
    });

    it('should return false for different UUIDs', () => {
      const code1 = new IdentificationCode('123e4567-e89b-12d3-a456-426614174000');
      const code2 = new IdentificationCode('987fcdeb-51a2-43d7-b987-654321098765');
      expect(code1.equals(code2)).toBe(false);
    });
  });

  describe('UUID format validation', () => {
    it('should accept valid UUID v4 format', () => {
      const validUUIDs = [
        '123e4567-e89b-12d3-a456-426614174000',
        '987fcdeb-51a2-43d7-b987-654321098765',
        '00000000-0000-0000-0000-000000000000',
        'ffffffff-ffff-ffff-ffff-ffffffffffff'
      ];

      validUUIDs.forEach(uuid => {
        expect(() => new IdentificationCode(uuid)).not.toThrow();
      });
    });

    it('should validate UUID version and variant', () => {
      // Valid UUID v4 (random)
      expect(() => new IdentificationCode('123e4567-e89b-42d3-a456-426614174000')).not.toThrow();
      
      // Invalid version (not 4)
      expect(() => new IdentificationCode('223e4567e89b12d3-a456-426614174000')).toThrow(InvalidUUIDError);
      
      // Invalid variant
      expect(() => new IdentificationCode('123e4567e89b12d3a45626614174000')).toThrow(InvalidUUIDError);
    });
  });
}); 