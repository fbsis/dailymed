import { DrugName } from '@/domain/value-objects/DrugName';
import { EmptyDrugNameError } from '@/domain/errors/EmptyDrugNameError';

describe('DrugName', () => {
  describe('instantiation', () => {
    it('should exist', () => {
      expect(DrugName).toBeDefined();
    });

    it('should be instantiable with valid name', () => {
      const drugName = new DrugName('Aspirin');
      expect(drugName).toBeInstanceOf(DrugName);
    });

    it('should throw EmptyDrugNameError for empty name', () => {
      expect(() => new DrugName('')).toThrow(EmptyDrugNameError);
      expect(() => new DrugName('   ')).toThrow(EmptyDrugNameError);
    });

    it('should trim whitespace from name', () => {
      const drugName = new DrugName('  Aspirin  ');
      expect(drugName.getValue()).toBe('Aspirin');
    });
  });

  describe('getters', () => {
    it('should return correct name value', () => {
      const drugName = new DrugName('Aspirin');
      expect(drugName.getValue()).toBe('Aspirin');
    });

    it('should return different instances for same values', () => {
      const drugName1 = new DrugName('Aspirin');
      const drugName2 = new DrugName('Aspirin');
      expect(drugName1).not.toBe(drugName2);
    });
  });

  describe('equals', () => {
    it('should return true for same name', () => {
      const drugName1 = new DrugName('Aspirin');
      const drugName2 = new DrugName('Aspirin');
      expect(drugName1.equals(drugName2)).toBe(true);
    });

    it('should return false for different names', () => {
      const drugName1 = new DrugName('Aspirin');
      const drugName2 = new DrugName('Ibuprofen');
      expect(drugName1.equals(drugName2)).toBe(false);
    });

    it('should be case sensitive', () => {
      const drugName1 = new DrugName('Aspirin');
      const drugName2 = new DrugName('aspirin');
      expect(drugName1.equals(drugName2)).toBe(false);
    });
  });

  describe('drug name validation', () => {
    it('should handle single word names', () => {
      expect(() => new DrugName('Aspirin')).not.toThrow();
      expect(() => new DrugName('Ibuprofen')).not.toThrow();
      expect(() => new DrugName('Paracetamol')).not.toThrow();
    });

    it('should handle compound names', () => {
      expect(() => new DrugName('Acetylsalicylic Acid')).not.toThrow();
      expect(() => new DrugName('Hydrochlorothiazide')).not.toThrow();
      expect(() => new DrugName('Metformin Hydrochloride')).not.toThrow();
    });

    it('should handle names with special characters', () => {
      expect(() => new DrugName('Vitamin D3')).not.toThrow();
      expect(() => new DrugName('Co-Q10')).not.toThrow();
      expect(() => new DrugName('5-HTP')).not.toThrow();
    });

    it('should handle names with numbers', () => {
      expect(() => new DrugName('Vitamin B12')).not.toThrow();
      expect(() => new DrugName('Tylenol 3')).not.toThrow();
      expect(() => new DrugName('Advil 200')).not.toThrow();
    });

    it('should handle names with hyphens and spaces', () => {
      expect(() => new DrugName('Beta-Blocker')).not.toThrow();
      expect(() => new DrugName('ACE Inhibitor')).not.toThrow();
      expect(() => new DrugName('Calcium Channel Blocker')).not.toThrow();
    });
  });
}); 