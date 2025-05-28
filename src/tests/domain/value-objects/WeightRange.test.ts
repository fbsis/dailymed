import { WeightRange } from '../../../domain/value-objects/WeightRange';
import { InvalidWeightRangeError } from '../../../domain/errors/InvalidWeightRangeError';

describe('WeightRange', () => {
  describe('instantiation', () => {
    it('should exist', () => {
      expect(WeightRange).toBeDefined();
    });

    it('should be instantiable with valid parameters', () => {
      const weightRange = new WeightRange(5, 10, 'kg');
      expect(weightRange).toBeInstanceOf(WeightRange);
    });

    it('should throw error for non-positive weight', () => {
      expect(() => new WeightRange(0, 10, 'kg')).toThrow(InvalidWeightRangeError);
      expect(() => new WeightRange(-1, 10, 'kg')).toThrow(InvalidWeightRangeError);
    });

    it('should throw error for invalid range', () => {
      expect(() => new WeightRange(10, 5, 'kg')).toThrow(InvalidWeightRangeError);
    });
  });

  describe('getters', () => {
    it('should return correct min weight', () => {
      const weightRange = new WeightRange(5, 10, 'kg');
      expect(weightRange.getMinWeight()).toBe(5);
    });

    it('should return correct max weight', () => {
      const weightRange = new WeightRange(5, 10, 'kg');
      expect(weightRange.getMaxWeight()).toBe(10);
    });

    it('should return null for max weight when not specified', () => {
      const weightRange = new WeightRange(5, null, 'kg');
      expect(weightRange.getMaxWeight()).toBeNull();
    });

    it('should return correct unit', () => {
      const weightRange = new WeightRange(5, 10, 'kg');
      expect(weightRange.getUnit()).toBe('kg');
    });
  });

  describe('toString', () => {
    it('should return correct string representation with max weight', () => {
      const weightRange = new WeightRange(5, 10, 'kg');
      expect(weightRange.toString()).toBe('5 to 10 kg');
    });

    it('should return correct string representation without max weight', () => {
      const weightRange = new WeightRange(5, null, 'kg');
      expect(weightRange.toString()).toBe('5 kg and above');
    });
  });

  describe('equals', () => {
    it('should return true for equal weight ranges', () => {
      const weightRange1 = new WeightRange(5, 10, 'kg');
      const weightRange2 = new WeightRange(5, 10, 'kg');
      expect(weightRange1.equals(weightRange2)).toBe(true);
    });

    it('should return false for different min weights', () => {
      const weightRange1 = new WeightRange(5, 10, 'kg');
      const weightRange2 = new WeightRange(6, 10, 'kg');
      expect(weightRange1.equals(weightRange2)).toBe(false);
    });

    it('should return false for different max weights', () => {
      const weightRange1 = new WeightRange(5, 10, 'kg');
      const weightRange2 = new WeightRange(5, 11, 'kg');
      expect(weightRange1.equals(weightRange2)).toBe(false);
    });

    it('should return false for different units', () => {
      const weightRange1 = new WeightRange(5, 10, 'kg');
      const weightRange2 = new WeightRange(5, 10, 'kg' as any);
      expect(weightRange1.equals(weightRange2)).toBe(false);
    });
  });
}); 