import { IndicationCode } from '@/domain/value-objects/IndicationCode';

describe('IndicationCode', () => {
  describe('instantiation', () => {
    it('should exist', () => {
      expect(IndicationCode).toBeDefined();
    });

    it('should be instantiable with valid parameters', () => {
      const code = new IndicationCode('1.1');
      expect(code).toBeInstanceOf(IndicationCode);
    });

    it('should throw error for empty code', () => {
      expect(() => new IndicationCode('')).toThrow('Indication code cannot be empty');
      expect(() => new IndicationCode('   ')).toThrow('Indication code cannot be empty');
    });

    it('should throw error for invalid format', () => {
      expect(() => new IndicationCode('1')).toThrow('Indication code must be in format X.X');
      expect(() => new IndicationCode('1.')).toThrow('Indication code must be in format X.X');
      expect(() => new IndicationCode('.1')).toThrow('Indication code must be in format X.X');
      expect(() => new IndicationCode('1.1.1')).toThrow('Indication code must be in format X.X');
      expect(() => new IndicationCode('a.b')).toThrow('Indication code must be in format X.X');
    });

    it('should trim whitespace', () => {
      const code = new IndicationCode('  1.1  ');
      expect(code.getValue()).toBe('1.1');
    });
  });

  describe('getters', () => {
    it('should return correct value', () => {
      const code = new IndicationCode('1.1');
      expect(code.getValue()).toBe('1.1');
    });
  });

  describe('equals', () => {
    it('should return true for equal codes', () => {
      const code1 = new IndicationCode('1.1');
      const code2 = new IndicationCode('1.1');
      expect(code1.equals(code2)).toBe(true);
    });

    it('should return false for different codes', () => {
      const code1 = new IndicationCode('1.1');
      const code2 = new IndicationCode('1.2');
      expect(code1.equals(code2)).toBe(false);
    });
  });
}); 