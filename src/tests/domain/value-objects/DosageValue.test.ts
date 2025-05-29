import { DosageValue } from '@/domain/value-objects/DosageValue';
import { InvalidDosageError } from '@/domain/errors/InvalidDosageError';

describe('DosageValue', () => {
  describe('instantiation', () => {
    it('should exist', () => {
      expect(DosageValue).toBeDefined();
    });

    it('should be instantiable with valid dosage in mg', () => {
      const dosageValue = new DosageValue('10 mg');
      expect(dosageValue).toBeInstanceOf(DosageValue);
    });

    it('should be instantiable with valid dosage in g', () => {
      const dosageValue = new DosageValue('1 g');
      expect(dosageValue).toBeInstanceOf(DosageValue);
    });

    it('should throw InvalidDosageError for empty dosage', () => {
      expect(() => new DosageValue('')).toThrow(InvalidDosageError);
      expect(() => new DosageValue('   ')).toThrow(InvalidDosageError);
    });

    it('should throw InvalidDosageError for missing unit', () => {
      expect(() => new DosageValue('10')).toThrow(InvalidDosageError);
      expect(() => new DosageValue('10 ml')).toThrow(InvalidDosageError);
    });

    it('should trim whitespace from dosage', () => {
      const dosageValue = new DosageValue('  10 mg  ');
      expect(dosageValue.getValue()).toBe('10 mg');
    });
  });

  describe('getters', () => {
    it('should return correct dosage value', () => {
      const dosageValue = new DosageValue('10 mg');
      expect(dosageValue.getValue()).toBe('10 mg');
    });

    it('should return different instances for same values', () => {
      const dosageValue1 = new DosageValue('10 mg');
      const dosageValue2 = new DosageValue('10 mg');
      expect(dosageValue1).not.toBe(dosageValue2);
    });
  });

  describe('equals', () => {
    it('should return true for same dosage', () => {
      const dosageValue1 = new DosageValue('10 mg');
      const dosageValue2 = new DosageValue('10 mg');
      expect(dosageValue1.equals(dosageValue2)).toBe(true);
    });

    it('should return false for different dosages', () => {
      const dosageValue1 = new DosageValue('10 mg');
      const dosageValue2 = new DosageValue('20 mg');
      expect(dosageValue1.equals(dosageValue2)).toBe(false);
    });

    it('should return false for different units', () => {
      const dosageValue1 = new DosageValue('10 mg');
      const dosageValue2 = new DosageValue('10 g');
      expect(dosageValue1.equals(dosageValue2)).toBe(false);
    });

    it('should be case sensitive', () => {
      const dosageValue1 = new DosageValue('10 mg');
      const dosageValue2 = new DosageValue('10 Mg');
      expect(dosageValue1.equals(dosageValue2)).toBe(false);
    });
  });

  describe('dosage validation', () => {
    it('should handle decimal values', () => {
      expect(() => new DosageValue('10.5 mg')).not.toThrow();
      const dosageValue = new DosageValue('10.5 mg');
      expect(dosageValue.getValue()).toBe('10.5 mg');
    });

    it('should handle typical dosage ranges', () => {
      // Small dosages
      expect(() => new DosageValue('0.5 mg')).not.toThrow();
      expect(() => new DosageValue('1 mg')).not.toThrow();
      // Medium dosages
      expect(() => new DosageValue('10 mg')).not.toThrow();
      expect(() => new DosageValue('100 mg')).not.toThrow();
      // Large dosages
      expect(() => new DosageValue('1 g')).not.toThrow();
      expect(() => new DosageValue('2 g')).not.toThrow();
    });

    it('should handle complex dosage formats', () => {
      expect(() => new DosageValue('10-20 mg')).not.toThrow();
      expect(() => new DosageValue('10 mg/kg')).not.toThrow();
      expect(() => new DosageValue('10 mg/mL')).not.toThrow();
    });
  });
}); 