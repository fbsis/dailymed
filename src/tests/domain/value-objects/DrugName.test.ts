import { DrugName } from '@/domain/value-objects/DrugName';

describe('DrugName', () => {
  describe('instantiation', () => {
    it('should exist', () => {
      expect(DrugName).toBeDefined();
    });

    it('should be instantiable with valid parameters', () => {
      const drugName = DrugName.create('Dupixent');
      expect(drugName).toBeInstanceOf(DrugName);
    });

    it('should throw error for empty name', () => {
      expect(() => DrugName.create('')).toThrow('Drug name cannot be empty');
      expect(() => DrugName.create('   ')).toThrow('Drug name cannot be empty');
    });

    it('should trim whitespace', () => {
      const drugName = DrugName.create('  Dupixent  ');
      expect(drugName.getValue()).toBe('Dupixent');
    });
  });

  describe('getters', () => {
    it('should return correct value', () => {
      const drugName = DrugName.create('Dupixent');
      expect(drugName.getValue()).toBe('Dupixent');
    });
  });

  describe('equals', () => {
    it('should return true for equal drug names', () => {
      const drugName1 = DrugName.create('Dupixent');
      const drugName2 = DrugName.create('Dupixent');
      expect(drugName1.equals(drugName2)).toBe(true);
    });

    it('should return false for different drug names', () => {
      const drugName1 = DrugName.create('Dupixent');
      const drugName2 = DrugName.create('Other Drug');
      expect(drugName1.equals(drugName2)).toBe(false);
    });

    it('should return false for different case', () => {
      const drugName1 = DrugName.create('Dupixent');
      const drugName2 = DrugName.create('DUPIXENT');
      expect(drugName1.equals(drugName2)).toBe(false);
    });
  });
}); 