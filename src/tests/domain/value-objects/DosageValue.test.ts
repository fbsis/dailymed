import { DosageValue } from '../../../domain/value-objects/DosageValue';
import { InvalidDosageError } from '../../../domain/errors/InvalidDosageError';

describe('DosageValue', () => {
  describe('instantiation', () => {
    it('should exist', () => {
      expect(DosageValue).toBeDefined();
    });

    it('should be instantiable with valid parameters', () => {
      const dosageValue = new DosageValue('300 mg');
      expect(dosageValue).toBeInstanceOf(DosageValue);
    });

    it('should throw error for empty dosage', () => {
      expect(() => new DosageValue('')).toThrow(InvalidDosageError);
      expect(() => new DosageValue('   ')).toThrow(InvalidDosageError);
    });

    it('should throw error for missing unit', () => {
      expect(() => new DosageValue('300')).toThrow(InvalidDosageError);
      expect(() => new DosageValue('300 ml')).toThrow(InvalidDosageError);
    });

    it('should trim whitespace', () => {
      const dosageValue = new DosageValue('  300 mg  ');
      expect(dosageValue.getValue()).toBe('300 mg');
    });
  });

  describe('getters', () => {
    it('should return correct value', () => {
      const dosageValue = new DosageValue('300 mg');
      expect(dosageValue.getValue()).toBe('300 mg');
    });
  });

  describe('equals', () => {
    it('should return true for equal dosage values', () => {
      const dosageValue1 = new DosageValue('300 mg');
      const dosageValue2 = new DosageValue('300 mg');
      expect(dosageValue1.equals(dosageValue2)).toBe(true);
    });

    it('should return false for different dosage values', () => {
      const dosageValue1 = new DosageValue('300 mg');
      const dosageValue2 = new DosageValue('400 mg');
      expect(dosageValue1.equals(dosageValue2)).toBe(false);
    });

    it('should return false for different units', () => {
      const dosageValue1 = new DosageValue('300 mg');
      const dosageValue2 = new DosageValue('300 g');
      expect(dosageValue1.equals(dosageValue2)).toBe(false);
    });
  });
}); 