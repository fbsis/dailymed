import { DrugName } from '@/domain/value-objects/DrugName';

describe('DrugName', () => {
  describe('instantiation', () => {
    it('should exist', () => {
      expect(DrugName).toBeDefined();
    });

    it('should be instantiable with valid parameters', () => {
      const drugName = new DrugName('Dupixent');
      expect(drugName).toBeInstanceOf(DrugName);
    });

    it('should throw error for empty name', () => {
      expect(() => new DrugName('')).toThrow('Drug name cannot be empty');
      expect(() => new DrugName('   ')).toThrow('Drug name cannot be empty');
    });

    it('should trim whitespace', () => {
      const drugName = new DrugName('  Dupixent  ');
      expect(drugName.getValue()).toBe('Dupixent');
    });
  });

  describe('getters', () => {
    it('should return correct value', () => {
      const drugName = new DrugName('Dupixent');
      expect(drugName.getValue()).toBe('Dupixent');
    });
  });

  describe('equals', () => {
    it('should return true for equal drug names', () => {
      const drugName1 = new DrugName('Dupixent');
      const drugName2 = new DrugName('Dupixent');
      expect(drugName1.equals(drugName2)).toBe(true);
    });

    it('should return false for different drug names', () => {
      const drugName1 = new DrugName('Dupixent');
      const drugName2 = new DrugName('Other Drug');
      expect(drugName1.equals(drugName2)).toBe(false);
    });

    it('should return false for different case', () => {
      const drugName1 = new DrugName('Dupixent');
      const drugName2 = new DrugName('DUPIXENT');
      expect(drugName1.equals(drugName2)).toBe(false);
    });
  });
}); 