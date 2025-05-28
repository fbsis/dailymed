import { Description } from '@/domain/value-objects/Description';

describe('Description', () => {
  describe('instantiation', () => {
    it('should exist', () => {
      expect(Description).toBeDefined();
    });

    it('should be instantiable with valid parameters', () => {
      const description = new Description('Dupixent is indicated for the treatment of adult and pediatric patients aged 6 months and older with moderate-to-severe atopic dermatitis (AD) whose disease is not adequately controlled with topical prescription therapies or when those therapies are not advisable.');
      expect(description).toBeInstanceOf(Description);
    });

    it('should throw error for empty description', () => {
      expect(() => new Description('')).toThrow('Description cannot be empty');
      expect(() => new Description('   ')).toThrow('Description cannot be empty');
    });

    it('should throw error for short description', () => {
      expect(() => new Description('Too short')).toThrow('Description must be at least 10 characters long');
    });

    it('should trim whitespace', () => {
      const description = new Description('  Dupixent is indicated for the treatment of AD.  ');
      expect(description.getValue()).toBe('Dupixent is indicated for the treatment of AD.');
    });
  });

  describe('getters', () => {
    it('should return correct value', () => {
      const description = new Description('Dupixent is indicated for the treatment of AD.');
      expect(description.getValue()).toBe('Dupixent is indicated for the treatment of AD.');
    });
  });

  describe('equals', () => {
    it('should return true for equal descriptions', () => {
      const description1 = new Description('Dupixent is indicated for the treatment of AD.');
      const description2 = new Description('Dupixent is indicated for the treatment of AD.');
      expect(description1.equals(description2)).toBe(true);
    });

    it('should return false for different descriptions', () => {
      const description1 = new Description('Dupixent is indicated for the treatment of AD.');
      const description2 = new Description('Dupixent is indicated for the treatment of asthma.');
      expect(description1.equals(description2)).toBe(false);
    });

    it('should return false for different case', () => {
      const description1 = new Description('Dupixent is indicated for the treatment of AD.');
      const description2 = new Description('DUPIXENT IS INDICATED FOR THE TREATMENT OF AD.');
      expect(description1.equals(description2)).toBe(false);
    });
  });
}); 