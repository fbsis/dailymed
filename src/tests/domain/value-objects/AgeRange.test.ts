import { AgeRange } from '../../../domain/value-objects/AgeRange';
import { InvalidAgeRangeError } from '../../../domain/errors/InvalidAgeRangeError';

describe('AgeRange', () => {
  describe('instantiation', () => {
    it('should exist', () => {
      expect(AgeRange).toBeDefined();
    });

    it('should be instantiable with valid parameters', () => {
      const ageRange = new AgeRange(0, 12, 'years');
      expect(ageRange).toBeInstanceOf(AgeRange);
    });

    it('should throw error for negative age', () => {
      expect(() => new AgeRange(-1, 12, 'years')).toThrow(InvalidAgeRangeError);
    });

    it('should throw error for invalid range', () => {
      expect(() => new AgeRange(12, 5, 'years')).toThrow(InvalidAgeRangeError);
    });

    it('should throw error for invalid months age', () => {
      expect(() => new AgeRange(13, null, 'months')).toThrow(InvalidAgeRangeError);
    });
  });

  describe('getters', () => {
    it('should return correct min age', () => {
      const ageRange = new AgeRange(5, 12, 'years');
      expect(ageRange.getMinAge()).toBe(5);
    });

    it('should return correct max age', () => {
      const ageRange = new AgeRange(5, 12, 'years');
      expect(ageRange.getMaxAge()).toBe(12);
    });

    it('should return null for max age when not specified', () => {
      const ageRange = new AgeRange(5, null, 'years');
      expect(ageRange.getMaxAge()).toBeNull();
    });

    it('should return correct unit', () => {
      const ageRange = new AgeRange(5, 12, 'years');
      expect(ageRange.getUnit()).toBe('years');
    });
  });

  describe('toString', () => {
    it('should return correct string representation with max age', () => {
      const ageRange = new AgeRange(5, 12, 'years');
      expect(ageRange.toString()).toBe('5 to 12 years');
    });

    it('should return correct string representation without max age', () => {
      const ageRange = new AgeRange(5, null, 'years');
      expect(ageRange.toString()).toBe('5 years and above');
    });
  });

  describe('equals', () => {
    it('should return true for equal age ranges', () => {
      const ageRange1 = new AgeRange(5, 12, 'years');
      const ageRange2 = new AgeRange(5, 12, 'years');
      expect(ageRange1.equals(ageRange2)).toBe(true);
    });

    it('should return false for different min ages', () => {
      const ageRange1 = new AgeRange(5, 12, 'years');
      const ageRange2 = new AgeRange(6, 12, 'years');
      expect(ageRange1.equals(ageRange2)).toBe(false);
    });

    it('should return false for different max ages', () => {
      const ageRange1 = new AgeRange(5, 12, 'years');
      const ageRange2 = new AgeRange(5, 13, 'years');
      expect(ageRange1.equals(ageRange2)).toBe(false);
    });

    it('should return false for different units', () => {
      const ageRange1 = new AgeRange(5, 12, 'years');
      const ageRange2 = new AgeRange(5, 12, 'months');
      expect(ageRange1.equals(ageRange2)).toBe(false);
    });
  });
}); 