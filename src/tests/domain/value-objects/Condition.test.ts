import { Condition } from '@/domain/value-objects/Condition';
import { EmptyConditionError, ShortConditionError } from '@/domain/errors';

describe('Condition', () => {
  describe('instantiation', () => {
    it('should exist', () => {
      expect(Condition).toBeDefined();
    });

    it('should be instantiable with valid condition', () => {
      const condition = new Condition('Hypertension');
      expect(condition).toBeInstanceOf(Condition);
    });

    it('should throw EmptyConditionError for empty condition', () => {
      expect(() => new Condition('')).toThrow(EmptyConditionError);
      expect(() => new Condition('   ')).toThrow(EmptyConditionError);
    });

    it('should throw ShortConditionError for condition shorter than 3 characters', () => {
      expect(() => new Condition('Hi')).toThrow(ShortConditionError);
      expect(() => new Condition('A')).toThrow(ShortConditionError);
    });

    it('should trim whitespace from condition', () => {
      const condition = new Condition('  Hypertension  ');
      expect(condition.getValue()).toBe('Hypertension');
    });
  });

  describe('getters', () => {
    it('should return correct condition value', () => {
      const condition = new Condition('Hypertension');
      expect(condition.getValue()).toBe('Hypertension');
    });

    it('should return different instances for same values', () => {
      const condition1 = new Condition('Hypertension');
      const condition2 = new Condition('Hypertension');
      expect(condition1).not.toBe(condition2);
    });
  });

  describe('equals', () => {
    it('should return true for same condition', () => {
      const condition1 = new Condition('Hypertension');
      const condition2 = new Condition('Hypertension');
      expect(condition1.equals(condition2)).toBe(true);
    });

    it('should return false for different conditions', () => {
      const condition1 = new Condition('Hypertension');
      const condition2 = new Condition('Diabetes');
      expect(condition1.equals(condition2)).toBe(false);
    });

    it('should be case sensitive', () => {
      const condition1 = new Condition('Hypertension');
      const condition2 = new Condition('hypertension');
      expect(condition1.equals(condition2)).toBe(false);
    });
  });

  describe('condition validation', () => {
    it('should handle minimum length condition', () => {
      expect(() => new Condition('Pain')).not.toThrow();
      const condition = new Condition('Pain');
      expect(condition.getValue()).toBe('Pain');
    });

    it('should handle typical medical conditions', () => {
      // Common conditions
      expect(() => new Condition('Hypertension')).not.toThrow();
      expect(() => new Condition('Type 2 Diabetes')).not.toThrow();
      expect(() => new Condition('Asthma')).not.toThrow();
      // Complex conditions
      expect(() => new Condition('Chronic Obstructive Pulmonary Disease')).not.toThrow();
      expect(() => new Condition('Rheumatoid Arthritis')).not.toThrow();
    });

    it('should handle conditions with special characters', () => {
      expect(() => new Condition('COVID-19')).not.toThrow();
      expect(() => new Condition('Type 1 & 2 Diabetes')).not.toThrow();
      expect(() => new Condition('HIV/AIDS')).not.toThrow();
    });
  });
}); 