import { Condition } from '@/domain/value-objects/Condition';

describe('Condition', () => {
  describe('instantiation', () => {
    it('should exist', () => {
      expect(Condition).toBeDefined();
    });

    it('should be instantiable with valid parameters', () => {
      const condition = new Condition('Atopic Dermatitis');
      expect(condition).toBeInstanceOf(Condition);
    });

    it('should throw error for empty condition', () => {
      expect(() => new Condition('')).toThrow('Condition cannot be empty');
      expect(() => new Condition('   ')).toThrow('Condition cannot be empty');
    });

    it('should throw error for short condition', () => {
      expect(() => new Condition('AD')).toThrow('Condition must be at least 3 characters long');
    });

    it('should trim whitespace', () => {
      const condition = new Condition('  Atopic Dermatitis  ');
      expect(condition.getValue()).toBe('Atopic Dermatitis');
    });
  });

  describe('getters', () => {
    it('should return correct value', () => {
      const condition = new Condition('Atopic Dermatitis');
      expect(condition.getValue()).toBe('Atopic Dermatitis');
    });
  });

  describe('equals', () => {
    it('should return true for equal conditions', () => {
      const condition1 = new Condition('Atopic Dermatitis');
      const condition2 = new Condition('Atopic Dermatitis');
      expect(condition1.equals(condition2)).toBe(true);
    });

    it('should return false for different conditions', () => {
      const condition1 = new Condition('Atopic Dermatitis');
      const condition2 = new Condition('Asthma');
      expect(condition1.equals(condition2)).toBe(false);
    });

    it('should return false for different case', () => {
      const condition1 = new Condition('Atopic Dermatitis');
      const condition2 = new Condition('atopic dermatitis');
      expect(condition1.equals(condition2)).toBe(false);
    });
  });
}); 