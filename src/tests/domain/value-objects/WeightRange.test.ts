import { WeightRange } from '@/domain/value-objects/WeightRange';
import { InvalidWeightRangeError } from '@/domain/errors/InvalidWeightRangeError';

describe('WeightRange', () => {
  describe('instantiation', () => {
    it('should exist', () => {
      expect(WeightRange).toBeDefined();
    });

    it('should be instantiable with valid range', () => {
      const weightRange = new WeightRange(5, 10, 'kg');
      expect(weightRange).toBeInstanceOf(WeightRange);
    });

    it('should throw InvalidWeightRangeError for non-positive weights', () => {
      expect(() => new WeightRange(0, 10, 'kg')).toThrow(InvalidWeightRangeError);
      expect(() => new WeightRange(-1, 10, 'kg')).toThrow(InvalidWeightRangeError);
      expect(() => new WeightRange(5, 0, 'kg')).toThrow(InvalidWeightRangeError);
    });

    it('should throw InvalidWeightRangeError for min greater than max', () => {
      expect(() => new WeightRange(10, 5, 'kg')).toThrow(InvalidWeightRangeError);
    });

    it('should accept null max weight', () => {
      const weightRange = new WeightRange(5, null, 'kg');
      expect(weightRange.getMaxWeight()).toBeNull();
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

    it('should return correct unit', () => {
      const weightRange = new WeightRange(5, 10, 'kg');
      expect(weightRange.getUnit()).toBe('kg');
    });

    it('should return different instances for same values', () => {
      const weightRange1 = new WeightRange(5, 10, 'kg');
      const weightRange2 = new WeightRange(5, 10, 'kg');
      expect(weightRange1).not.toBe(weightRange2);
    });
  });

  describe('toString', () => {
    it('should return correct string for range with max weight', () => {
      const weightRange = new WeightRange(5, 10, 'kg');
      expect(weightRange.toString()).toBe('5 to 10 kg');
    });

    it('should return correct string for range without max weight', () => {
      const weightRange = new WeightRange(5, null, 'kg');
      expect(weightRange.toString()).toBe('5 kg and above');
    });
  });

  describe('weight validation', () => {
    it('should handle decimal weights', () => {
      expect(() => new WeightRange(5.5, 10.5, 'kg')).not.toThrow();
      const weightRange = new WeightRange(5.5, 10.5, 'kg');
      expect(weightRange.getMinWeight()).toBe(5.5);
      expect(weightRange.getMaxWeight()).toBe(10.5);
    });

    it('should handle typical weight ranges', () => {
      // Infant weight range
      expect(() => new WeightRange(3, 10, 'kg')).not.toThrow();
      // Child weight range
      expect(() => new WeightRange(10, 30, 'kg')).not.toThrow();
      // Adult weight range
      expect(() => new WeightRange(30, 100, 'kg')).not.toThrow();
    });
  });
}); 