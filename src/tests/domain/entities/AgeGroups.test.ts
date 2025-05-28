import { AgeGroups } from '../../../domain/entities/AgeGroups';
import { AgeBasedDosage } from '../../../domain/entities/AgeBasedDosage';
import { AgeRange } from '../../../domain/value-objects/AgeRange';
import { WeightRange } from '../../../domain/value-objects/WeightRange';
import { DosageValue } from '../../../domain/value-objects/DosageValue';
import { EmptyDosageListError } from '../../../domain/errors/EmptyDosageListError';
import { DosageNotFoundError } from '../../../domain/errors/DosageNotFoundError';

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
  });

  describe('getters', () => {
    it('should return all age based dosages', () => {
      const ageGroups = new AgeGroups([ageBasedDosage1, ageBasedDosage2]);
      const returnedDosages = ageGroups.getAllAgeBasedDosages();
      expect(returnedDosages).toHaveLength(2);
      expect(returnedDosages).toContain(ageBasedDosage1);
      expect(returnedDosages).toContain(ageBasedDosage2);
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
      expect(ageGroups.getDosageForAgeAndWeight(0, 'years', 7)).toBe(ageBasedDosage1);
      expect(ageGroups.getDosageForAgeAndWeight(12, 'years', 7)).toBe(ageBasedDosage2);
    });

    it('should throw error for age below range', () => {
      const ageGroups = new AgeGroups([ageBasedDosage1, ageBasedDosage2]);
      expect(() => ageGroups.getDosageForAgeAndWeight(-1, 'years', 7)).toThrow(DosageNotFoundError);
    });

    it('should throw error for age above range', () => {
      const ageGroups = new AgeGroups([ageBasedDosage1, ageBasedDosage2]);
      expect(() => ageGroups.getDosageForAgeAndWeight(18, 'years', 7)).toThrow(DosageNotFoundError);
    });

    it('should handle age range without max age', () => {
      const openAgeRange = new AgeRange(17, null, 'years');
      const openAgeBasedDosage = new AgeBasedDosage(openAgeRange, weightBasedDosages);
      const ageGroups = new AgeGroups([ageBasedDosage1, ageBasedDosage2, openAgeBasedDosage]);

      expect(ageGroups.getDosageForAgeAndWeight(20, 'years', 7)).toBe(openAgeBasedDosage);
      expect(() => ageGroups.getDosageForAgeAndWeight(16, 'years', 7)).toThrow(DosageNotFoundError);
    });

    it('should handle months age unit', () => {
      const monthsAgeRange = new AgeRange(0, 12, 'months');
      const monthsAgeBasedDosage = new AgeBasedDosage(monthsAgeRange, weightBasedDosages);
      const ageGroups = new AgeGroups([monthsAgeBasedDosage, ageBasedDosage1, ageBasedDosage2]);

      expect(ageGroups.getDosageForAgeAndWeight(6, 'months', 7)).toBe(monthsAgeBasedDosage);
      expect(() => ageGroups.getDosageForAgeAndWeight(13, 'months', 7)).toThrow(DosageNotFoundError);
    });
  });
}); 