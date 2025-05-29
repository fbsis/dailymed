import { IndicationCode } from '@/domain/value-objects/IndicationCode';

describe('IndicationCode', () => {
  describe('instantiation', () => {
    it('should exist', () => {
      expect(IndicationCode).toBeDefined();
    });

    it('should be instantiable with valid code', () => {
      const indicationCode = new IndicationCode('10.1');
      expect(indicationCode).toBeInstanceOf(IndicationCode);
    });

    it('should throw error for empty code', () => {
      expect(() => new IndicationCode('')).toThrow('Indication code cannot be empty');
      expect(() => new IndicationCode('   ')).toThrow('Indication code cannot be empty');
    });

    it('should throw error for invalid format', () => {
      expect(() => new IndicationCode('101')).toThrow('Indication code must be in format X.X');
      expect(() => new IndicationCode('10.1.1')).toThrow('Indication code must be in format X.X');
      expect(() => new IndicationCode('10,1')).toThrow('Indication code must be in format X.X');
      expect(() => new IndicationCode('abc')).toThrow('Indication code must be in format X.X');
    });

  });

  describe('getters', () => {
    it('should return correct code value', () => {
      const indicationCode = new IndicationCode('10.1');
      expect(indicationCode.getValue()).toBe('10.1');
    });

    it('should return different instances for same values', () => {
      const indicationCode1 = new IndicationCode('10.1');
      const indicationCode2 = new IndicationCode('10.1');
      expect(indicationCode1).not.toBe(indicationCode2);
    });
  });

  describe('equals', () => {
    it('should return true for same code', () => {
      const indicationCode1 = new IndicationCode('10.1');
      const indicationCode2 = new IndicationCode('10.1');
      expect(indicationCode1.equals(indicationCode2)).toBe(true);
    });

    it('should return false for different codes', () => {
      const indicationCode1 = new IndicationCode('10.1');
      const indicationCode2 = new IndicationCode('10.2');
      expect(indicationCode1.equals(indicationCode2)).toBe(false);
    });
  });

  describe('code validation', () => {
    it('should handle single digit codes', () => {
      expect(() => new IndicationCode('1.1')).not.toThrow();
      expect(() => new IndicationCode('1.2')).not.toThrow();
      expect(() => new IndicationCode('1.3')).not.toThrow();
    });

    it('should handle double digit codes', () => {
      expect(() => new IndicationCode('10.1')).not.toThrow();
      expect(() => new IndicationCode('10.2')).not.toThrow();
      expect(() => new IndicationCode('10.3')).not.toThrow();
    });

    it('should handle triple digit codes', () => {
      expect(() => new IndicationCode('100.1')).not.toThrow();
      expect(() => new IndicationCode('100.2')).not.toThrow();
      expect(() => new IndicationCode('100.3')).not.toThrow();
    });

    it('should handle codes with leading zeros', () => {
      expect(() => new IndicationCode('01.1')).not.toThrow();
      expect(() => new IndicationCode('01.2')).not.toThrow();
      expect(() => new IndicationCode('01.3')).not.toThrow();
    });

    it('should handle codes with trailing zeros', () => {
      expect(() => new IndicationCode('1.10')).not.toThrow();
      expect(() => new IndicationCode('1.20')).not.toThrow();
      expect(() => new IndicationCode('1.30')).not.toThrow();
    });

    it('should reject invalid formats', () => {
      // Missing decimal point
      expect(() => new IndicationCode('101')).toThrow('Indication code must be in format X.X');
      // Multiple decimal points
      expect(() => new IndicationCode('1.0.1')).toThrow('Indication code must be in format X.X');
      // Non-numeric characters
      expect(() => new IndicationCode('1.a')).toThrow('Indication code must be in format X.X');
      expect(() => new IndicationCode('a.1')).toThrow('Indication code must be in format X.X');
      // Special characters
      expect(() => new IndicationCode('1,1')).toThrow('Indication code must be in format X.X');
      expect(() => new IndicationCode('1-1')).toThrow('Indication code must be in format X.X');
    });
  });
}); 