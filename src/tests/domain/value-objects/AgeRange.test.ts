import { AgeRange } from '@/domain/value-objects/AgeRange';
import { InvalidAgeRangeError } from '@/domain/errors/InvalidAgeRangeError';

describe('AgeRange', () => {
  describe('instantiation', () => {
    it('should exist', () => {
      expect(AgeRange).toBeDefined();
    });

    it('should be instantiable with valid range in years', () => {
      const ageRange = new AgeRange(5, 10, 'years');
      expect(ageRange).toBeInstanceOf(AgeRange);
    });

    it('should be instantiable with valid range in months', () => {
      const ageRange = new AgeRange(3, 6, 'months');
      expect(ageRange).toBeInstanceOf(AgeRange);
    });

    it('should throw InvalidAgeRangeError for negative age', () => {
      expect(() => new AgeRange(-1, 10, 'years')).toThrow(InvalidAgeRangeError);
    });

    it('should throw InvalidAgeRangeError for min greater than max', () => {
      expect(() => new AgeRange(10, 5, 'years')).toThrow(InvalidAgeRangeError);
    });

    it('should throw InvalidAgeRangeError for months age greater than 12', () => {
      expect(() => new AgeRange(13, 24, 'months')).toThrow(InvalidAgeRangeError);
    });

    it('should accept null max age', () => {
      const ageRange = new AgeRange(5, null, 'years');
      expect(ageRange.getMaxAge()).toBeNull();
    });
  });

  describe('getters', () => {
    it('should return correct min age', () => {
      const ageRange = new AgeRange(5, 10, 'years');
      expect(ageRange.getMinAge()).toBe(5);
    });

    it('should return correct max age', () => {
      const ageRange = new AgeRange(5, 10, 'years');
      expect(ageRange.getMaxAge()).toBe(10);
    });

    it('should return correct unit', () => {
      const ageRange = new AgeRange(5, 10, 'years');
      expect(ageRange.getUnit()).toBe('years');
    });

    it('should return different instances for same values', () => {
      const ageRange1 = new AgeRange(5, 10, 'years');
      const ageRange2 = new AgeRange(5, 10, 'years');
      expect(ageRange1).not.toBe(ageRange2);
    });
  });

  describe('equals', () => {
    it('should return true for same range', () => {
      const ageRange1 = new AgeRange(5, 10, 'years');
      const ageRange2 = new AgeRange(5, 10, 'years');
      expect(ageRange1.equals(ageRange2)).toBe(true);
    });

    it('should return false for different ranges', () => {
      const ageRange1 = new AgeRange(5, 10, 'years');
      const ageRange2 = new AgeRange(5, 15, 'years');
      expect(ageRange1.equals(ageRange2)).toBe(false);
    });

    it('should return false for different units', () => {
      const ageRange1 = new AgeRange(5, 10, 'years');
      const ageRange2 = new AgeRange(5, 10, 'months');
      expect(ageRange1.equals(ageRange2)).toBe(false);
    });

    it('should return false for different min ages', () => {
      const ageRange1 = new AgeRange(5, 10, 'years');
      const ageRange2 = new AgeRange(6, 10, 'years');
      expect(ageRange1.equals(ageRange2)).toBe(false);
    });

    it('should return false when one has null max age', () => {
      const ageRange1 = new AgeRange(5, null, 'years');
      const ageRange2 = new AgeRange(5, 10, 'years');
      expect(ageRange1.equals(ageRange2)).toBe(false);
    });

    it('should return true when both have null max age', () => {
      const ageRange1 = new AgeRange(5, null, 'years');
      const ageRange2 = new AgeRange(5, null, 'years');
      expect(ageRange1.equals(ageRange2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return correct string for range with max age', () => {
      const ageRange = new AgeRange(5, 10, 'years');
      expect(ageRange.toString()).toBe('5 to 10 years');
    });

    it('should return correct string for range without max age', () => {
      const ageRange = new AgeRange(5, null, 'years');
      expect(ageRange.toString()).toBe('5 years and above');
    });

    it('should return correct string for months range', () => {
      const ageRange = new AgeRange(3, 6, 'months');
      expect(ageRange.toString()).toBe('3 to 6 months');
    });
  });

  describe('age validation', () => {
    it('should handle zero age', () => {
      expect(() => new AgeRange(0, 10, 'years')).not.toThrow();
    });

    it('should handle decimal ages', () => {
      expect(() => new AgeRange(5.5, 10.5, 'years')).not.toThrow();
      const ageRange = new AgeRange(5.5, 10.5, 'years');
      expect(ageRange.getMinAge()).toBe(5.5);
      expect(ageRange.getMaxAge()).toBe(10.5);
    });

    it('should handle typical age ranges', () => {
      // Infant age range (months)
      expect(() => new AgeRange(0, 12, 'months')).not.toThrow();
      // Child age range (years)
      expect(() => new AgeRange(1, 12, 'years')).not.toThrow();
      // Teen age range (years)
      expect(() => new AgeRange(12, 18, 'years')).not.toThrow();
      // Adult age range (years)
      expect(() => new AgeRange(18, null, 'years')).not.toThrow();
    });
  });
}); 