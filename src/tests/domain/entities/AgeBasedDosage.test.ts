import { AgeBasedDosage } from '../../../domain/entities/AgeBasedDosage';
import { AgeRange } from '../../../domain/value-objects/AgeRange';
import { WeightRange } from '../../../domain/value-objects/WeightRange';
import { DosageValue } from '../../../domain/value-objects/DosageValue';
import { EmptyDosageListError } from '../../../domain/errors/EmptyDosageListError';
import { DosageNotFoundError } from '../../../domain/errors/DosageNotFoundError';

describe('AgeBasedDosage', () => {
  let ageRange: AgeRange;
  let weightRange: WeightRange;
  let dosageValue: DosageValue;
  let weightBasedDosages: Map<WeightRange, DosageValue>;

  beforeEach(() => {
    ageRange = new AgeRange(0, 12, 'years');
    weightRange = new WeightRange(5, 10, 'kg');
    dosageValue = new DosageValue('300 mg');
    weightBasedDosages = new Map([[weightRange, dosageValue]]);
  });

  describe('instantiation', () => {
    it('should exist', () => {
      expect(AgeBasedDosage).toBeDefined();
    });

    it('should be instantiable with valid parameters', () => {
      const ageBasedDosage = new AgeBasedDosage(ageRange, weightBasedDosages);
      expect(ageBasedDosage).toBeInstanceOf(AgeBasedDosage);
    });

    it('should throw error for empty weight based dosages', () => {
      expect(() => new AgeBasedDosage(ageRange, new Map())).toThrow(EmptyDosageListError);
    });
  });

  describe('getters', () => {
    it('should return correct age range', () => {
      const ageBasedDosage = new AgeBasedDosage(ageRange, weightBasedDosages);
      expect(ageBasedDosage.getAgeRange()).toBe(ageRange);
    });

    it('should return correct weight based dosages', () => {
      const ageBasedDosage = new AgeBasedDosage(ageRange, weightBasedDosages);
      const returnedDosages = ageBasedDosage.getAllWeightBasedDosages();
      expect(returnedDosages).toBeInstanceOf(Map);
      expect(returnedDosages.size).toBe(1);
      expect(returnedDosages.get(weightRange)).toBe(dosageValue);
    });
  });

  describe('getDosageForWeight', () => {
    it('should return correct dosage for weight within range', () => {
      const ageBasedDosage = new AgeBasedDosage(ageRange, weightBasedDosages);
      expect(ageBasedDosage.getDosageForWeight(7)).toBe(dosageValue);
    });

    it('should return correct dosage for weight at range boundaries', () => {
      const ageBasedDosage = new AgeBasedDosage(ageRange, weightBasedDosages);
      expect(ageBasedDosage.getDosageForWeight(5)).toBe(dosageValue);
      expect(ageBasedDosage.getDosageForWeight(10)).toBe(dosageValue);
    });

    it('should throw error for weight below range', () => {
      const ageBasedDosage = new AgeBasedDosage(ageRange, weightBasedDosages);
      expect(() => ageBasedDosage.getDosageForWeight(4)).toThrow(DosageNotFoundError);
    });

    it('should throw error for weight above range', () => {
      const ageBasedDosage = new AgeBasedDosage(ageRange, weightBasedDosages);
      expect(() => ageBasedDosage.getDosageForWeight(11)).toThrow(DosageNotFoundError);
    });

    it('should handle multiple weight ranges', () => {
      const weightRange2 = new WeightRange(10, 15, 'kg');
      const dosageValue2 = new DosageValue('400 mg');
      const multipleDosages = new Map([
        [weightRange, dosageValue],
        [weightRange2, dosageValue2]
      ]);

      const ageBasedDosage = new AgeBasedDosage(ageRange, multipleDosages);
      expect(ageBasedDosage.getDosageForWeight(7)).toBe(dosageValue);
      expect(ageBasedDosage.getDosageForWeight(12)).toBe(dosageValue2);
    });

    it('should handle weight range without max weight', () => {
      const openWeightRange = new WeightRange(10, null, 'kg');
      const openDosages = new Map([[openWeightRange, dosageValue]]);
      const ageBasedDosage = new AgeBasedDosage(ageRange, openDosages);

      expect(ageBasedDosage.getDosageForWeight(15)).toBe(dosageValue);
      expect(() => ageBasedDosage.getDosageForWeight(5)).toThrow(DosageNotFoundError);
    });
  });
}); 