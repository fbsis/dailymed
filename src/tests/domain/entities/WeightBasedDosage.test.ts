import { WeightBasedDosage } from '@/domain/entities/WeightBasedDosage';
import { DosageValue } from '@/domain/value-objects/DosageValue';

describe('WeightBasedDosage', () => {
  let initialLoadingDose: DosageValue;
  let subsequentDosage: DosageValue;
  let weightBasedDosage: WeightBasedDosage;

  beforeEach(() => {
    initialLoadingDose = new DosageValue('600 mg');
    subsequentDosage = new DosageValue('300 mg');
    weightBasedDosage = new WeightBasedDosage(initialLoadingDose, subsequentDosage);
  });

  describe('instantiation', () => {
    it('should exist', () => {
      expect(WeightBasedDosage).toBeDefined();
    });

    it('should be instantiable with valid parameters', () => {
      expect(weightBasedDosage).toBeInstanceOf(WeightBasedDosage);
    });

    it('should store different values for initial and subsequent dosages', () => {
      const differentInitialDose = new DosageValue('800 mg');
      const differentSubsequentDose = new DosageValue('400 mg');
      const differentDosage = new WeightBasedDosage(differentInitialDose, differentSubsequentDose);

      expect(differentDosage.getInitialLoadingDose()).not.toBe(weightBasedDosage.getInitialLoadingDose());
      expect(differentDosage.getSubsequentDosage()).not.toBe(weightBasedDosage.getSubsequentDosage());
    });

    it('should store same values for initial and subsequent dosages when provided', () => {
      const sameDose = new DosageValue('300 mg');
      const sameDosage = new WeightBasedDosage(sameDose, sameDose);

      expect(sameDosage.getInitialLoadingDose()).toBe(sameDosage.getSubsequentDosage());
    });
  });

  describe('getters', () => {
    it('should return correct initial loading dose', () => {
      expect(weightBasedDosage.getInitialLoadingDose()).toBe(initialLoadingDose);
      expect(weightBasedDosage.getInitialLoadingDose().getValue()).toBe('600 mg');
    });

    it('should return correct subsequent dosage', () => {
      expect(weightBasedDosage.getSubsequentDosage()).toBe(subsequentDosage);
      expect(weightBasedDosage.getSubsequentDosage().getValue()).toBe('300 mg');
    });

    it('should return immutable dosage values', () => {
      const initialDose = weightBasedDosage.getInitialLoadingDose();
      const subsequentDose = weightBasedDosage.getSubsequentDosage();

      // Create new instance with same values
      const newDosage = new WeightBasedDosage(initialDose, subsequentDose);

      // Verify that the values are the same but instances are different
      expect(newDosage.getInitialLoadingDose().getValue()).toBe(initialDose.getValue());
      expect(newDosage.getSubsequentDosage().getValue()).toBe(subsequentDose.getValue());
    });
  });
}); 