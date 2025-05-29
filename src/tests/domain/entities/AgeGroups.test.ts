import { AgeGroups } from '@/domain/entities/AgeGroups';
import { AgeBasedDosage } from '@/domain/entities/AgeBasedDosage';
import { AgeRange } from '@/domain/value-objects/AgeRange';
import { WeightRange } from '@/domain/value-objects/WeightRange';
import { DosageValue } from '@/domain/value-objects/DosageValue';
import { EmptyDosageListError, DosageNotFoundError } from '@/domain/errors';

describe('AgeGroups', () => {
  let ageRange1: AgeRange;
  let ageRange2: AgeRange;
  let weightRange: WeightRange;
  let dosageValue: DosageValue;
  let weightBasedDosages: Map<WeightRange, DosageValue>;
  let ageBasedDosage1: AgeBasedDosage;
  let ageBasedDosage2: AgeBasedDosage;

  beforeEach(() => {
    ageRange1 = new AgeRange(0, 12, 'years');
    ageRange2 = new AgeRange(12, 17, 'years');
    weightRange = new WeightRange(5, 10, 'kg');
    dosageValue = new DosageValue('300 mg');
    weightBasedDosages = new Map([[weightRange, dosageValue]]);
    ageBasedDosage1 = new AgeBasedDosage(ageRange1, weightBasedDosages);
    ageBasedDosage2 = new AgeBasedDosage(ageRange2, weightBasedDosages);
  });

  describe('instantiation', () => {
    it('should exist', () => {
      expect(AgeGroups).toBeDefined();
    });

    it('should be instantiable with valid parameters', () => {
      const ageGroups = new AgeGroups([ageBasedDosage1]);
      expect(ageGroups).toBeInstanceOf(AgeGroups);
    });

    it('should throw error for empty age based dosages', () => {
      expect(() => new AgeGroups([])).toThrow(EmptyDosageListError);
    });

    it('should handle single age based dosage', () => {
      const ageGroups = new AgeGroups([ageBasedDosage1]);
      expect(ageGroups.getDosageForAgeAndWeight(6, 'years', 7)).toBe(ageBasedDosage1);
    });
  });

  describe('getters', () => {
    it('should return all age based dosages', () => {
      const ageGroups = new AgeGroups([ageBasedDosage1, ageBasedDosage2]);
      const returnedDosages = ageGroups.getAllAgeBasedDosages();
      expect(returnedDosages).toHaveLength(2);
      expect(returnedDosages).toContain(ageBasedDosage1);
      expect(returnedDosages).toContain(ageBasedDosage2);
    });

    it('should return a new array instance', () => {
      const ageGroups = new AgeGroups([ageBasedDosage1]);
      const dosages1 = ageGroups.getAllAgeBasedDosages();
      const dosages2 = ageGroups.getAllAgeBasedDosages();
      expect(dosages1).not.toBe(dosages2);
    });
  });

  describe('getDosageForAgeAndWeight', () => {
    it('should return correct dosage for age and weight within range', () => {
      const ageGroups = new AgeGroups([ageBasedDosage1, ageBasedDosage2]);
      expect(ageGroups.getDosageForAgeAndWeight(6, 'years', 7)).toBe(ageBasedDosage1);
      expect(ageGroups.getDosageForAgeAndWeight(14, 'years', 7)).toBe(ageBasedDosage2);
    });

    it('should return correct dosage for age at range boundaries', () => {
      const ageGroups = new AgeGroups([ageBasedDosage1, ageBasedDosage2]);
      // Test lower boundary of first range
      expect(ageGroups.getDosageForAgeAndWeight(0, 'years', 7)).toBe(ageBasedDosage1);
      // Test upper boundary of first range
      expect(ageGroups.getDosageForAgeAndWeight(11, 'years', 7)).toBe(ageBasedDosage1);
      // Test lower boundary of second range
      expect(ageGroups.getDosageForAgeAndWeight(12, 'years', 7)).toBe(ageBasedDosage2);
      // Test upper boundary of second range
      expect(ageGroups.getDosageForAgeAndWeight(17, 'years', 7)).toBe(ageBasedDosage2);
    });

    it('should throw error for age below range', () => {
      const ageGroups = new AgeGroups([ageBasedDosage1, ageBasedDosage2]);
      expect(() => ageGroups.getDosageForAgeAndWeight(-1, 'years', 7)).toThrow(DosageNotFoundError);
    });

    it('should throw error for age above range', () => {
      const ageGroups = new AgeGroups([ageBasedDosage1, ageBasedDosage2]);
      expect(() => ageGroups.getDosageForAgeAndWeight(18, 'years', 7)).toThrow(DosageNotFoundError);
    });

    it('should handle overlapping age ranges', () => {
      const overlappingRange1 = new AgeRange(10, 15, 'years');
      const overlappingRange2 = new AgeRange(12, 17, 'years');
      const overlappingDosage1 = new AgeBasedDosage(overlappingRange1, weightBasedDosages);
      const overlappingDosage2 = new AgeBasedDosage(overlappingRange2, weightBasedDosages);
      const ageGroups = new AgeGroups([overlappingDosage1, overlappingDosage2]);

      // Should return the first matching range (based on minAge)
      expect(ageGroups.getDosageForAgeAndWeight(12, 'years', 7)).toBe(overlappingDosage1);
      expect(ageGroups.getDosageForAgeAndWeight(13, 'years', 7)).toBe(overlappingDosage1);
      expect(ageGroups.getDosageForAgeAndWeight(14, 'years', 7)).toBe(overlappingDosage1);
    });

    it('should handle different age units in ranges', () => {
      const monthsRange = new AgeRange(0, 12, 'months');
      const yearsRange = new AgeRange(1, 12, 'years');
      const monthsDosage = new AgeBasedDosage(monthsRange, weightBasedDosages);
      const yearsDosage = new AgeBasedDosage(yearsRange, weightBasedDosages);
      const ageGroups = new AgeGroups([monthsDosage, yearsDosage]);

      expect(ageGroups.getDosageForAgeAndWeight(6, 'months', 7)).toBe(monthsDosage);
      expect(ageGroups.getDosageForAgeAndWeight(2, 'years', 7)).toBe(yearsDosage);
      expect(() => ageGroups.getDosageForAgeAndWeight(13, 'months', 7)).toThrow(DosageNotFoundError);
    });
  });

  describe('error handling', () => {
    it('should throw EmptyDosageListError when no dosages provided', () => {
      expect(() => new AgeGroups([])).toThrow(EmptyDosageListError);
    });

    it('should throw DosageNotFoundError for age at last range boundary', () => {
      const ageRange = new AgeRange(0, 12, 'years');
      const weightRange = new WeightRange(5, 10, 'kg');
      const dosageValue = new DosageValue('300 mg');
      const weightBasedDosages = new Map([[weightRange, dosageValue]]);
      const ageBasedDosage = new AgeBasedDosage(ageRange, weightBasedDosages);
      const ageGroups = new AgeGroups([ageBasedDosage]);

      // Should throw for age above max
      expect(() => ageGroups.getDosageForAgeAndWeight(13, 'years', 7)).toThrow(DosageNotFoundError);
    });

    it('should handle last range with max age correctly', () => {
      const ageRange1 = new AgeRange(0, 12, 'years');
      const ageRange2 = new AgeRange(12, 17, 'years');
      const weightRange = new WeightRange(5, 10, 'kg');
      const dosageValue = new DosageValue('300 mg');
      const weightBasedDosages = new Map([[weightRange, dosageValue]]);
      
      const ageBasedDosage1 = new AgeBasedDosage(ageRange1, weightBasedDosages);
      const ageBasedDosage2 = new AgeBasedDosage(ageRange2, weightBasedDosages);
      const ageGroups = new AgeGroups([ageBasedDosage1, ageBasedDosage2]);

      // Should return last dosage for max age
      expect(ageGroups.getDosageForAgeAndWeight(17, 'years', 7)).toBe(ageBasedDosage2);
      
      // Should throw for age above max
      expect(() => ageGroups.getDosageForAgeAndWeight(18, 'years', 7)).toThrow(DosageNotFoundError);
    });

    it('should handle last range with different age unit', () => {
      const ageRange1 = new AgeRange(0, 12, 'months');
      const ageRange2 = new AgeRange(1, 12, 'years');
      const weightRange = new WeightRange(5, 10, 'kg');
      const dosageValue = new DosageValue('300 mg');
      const weightBasedDosages = new Map([[weightRange, dosageValue]]);
      
      const ageBasedDosage1 = new AgeBasedDosage(ageRange1, weightBasedDosages);
      const ageBasedDosage2 = new AgeBasedDosage(ageRange2, weightBasedDosages);
      const ageGroups = new AgeGroups([ageBasedDosage1, ageBasedDosage2]);

      // Should return last dosage for max age in years
      expect(ageGroups.getDosageForAgeAndWeight(12, 'years', 7)).toBe(ageBasedDosage2);
      
      // Should throw for age above max in years
      expect(() => ageGroups.getDosageForAgeAndWeight(13, 'years', 7)).toThrow(DosageNotFoundError);
      
      // Should throw for age in months when last range is in years
      expect(() => ageGroups.getDosageForAgeAndWeight(13, 'months', 7)).toThrow(DosageNotFoundError);
    });

    it('should handle last range with null max age', () => {
      const ageRange1 = new AgeRange(0, 12, 'years');
      const ageRange2 = new AgeRange(12, null, 'years');
      const weightRange = new WeightRange(5, 10, 'kg');
      const dosageValue = new DosageValue('300 mg');
      const weightBasedDosages = new Map([[weightRange, dosageValue]]);
      
      const ageBasedDosage1 = new AgeBasedDosage(ageRange1, weightBasedDosages);
      const ageBasedDosage2 = new AgeBasedDosage(ageRange2, weightBasedDosages);
      const ageGroups = new AgeGroups([ageBasedDosage1, ageBasedDosage2]);

      // Should return last dosage for any age above min
      expect(ageGroups.getDosageForAgeAndWeight(20, 'years', 7)).toBe(ageBasedDosage2);
      expect(ageGroups.getDosageForAgeAndWeight(30, 'years', 7)).toBe(ageBasedDosage2);
    });
  });
}); 