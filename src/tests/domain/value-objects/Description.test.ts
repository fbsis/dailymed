import { Description } from '@/domain/value-objects/Description';

describe('Description', () => {
  describe('instantiation', () => {
    it('should exist', () => {
      expect(Description).toBeDefined();
    });

    it('should be instantiable with valid description', () => {
      const description = new Description('This is a valid description that meets the minimum length requirement.');
      expect(description).toBeInstanceOf(Description);
    });

    it('should throw error for empty description', () => {
      expect(() => new Description('')).toThrow('Description cannot be empty');
      expect(() => new Description('   ')).toThrow('Description cannot be empty');
    });

    it('should throw error for description shorter than 10 characters', () => {
      expect(() => new Description('Too short')).toThrow('Description must be at least 10 characters long');
      expect(() => new Description('Short')).toThrow('Description must be at least 10 characters long');
    });

    it('should trim whitespace from description', () => {
      const description = new Description('  This is a valid description.  ');
      expect(description.getValue()).toBe('This is a valid description.');
    });
  });

  describe('getters', () => {
    it('should return correct description value', () => {
      const description = new Description('This is a valid description that meets the minimum length requirement.');
      expect(description.getValue()).toBe('This is a valid description that meets the minimum length requirement.');
    });

    it('should return different instances for same values', () => {
      const description1 = new Description('This is a valid description.');
      const description2 = new Description('This is a valid description.');
      expect(description1).not.toBe(description2);
    });
  });

  describe('equals', () => {
    it('should return true for same description', () => {
      const description1 = new Description('This is a valid description.');
      const description2 = new Description('This is a valid description.');
      expect(description1.equals(description2)).toBe(true);
    });

    it('should return false for different descriptions', () => {
      const description1 = new Description('This is the first description.');
      const description2 = new Description('This is the second description.');
      expect(description1.equals(description2)).toBe(false);
    });

    it('should be case sensitive', () => {
      const description1 = new Description('This is a valid description.');
      const description2 = new Description('this is a valid description.');
      expect(description1.equals(description2)).toBe(false);
    });
  });

  describe('description validation', () => {
    it('should handle minimum length description', () => {
      expect(() => new Description('This is a minimum length description.')).not.toThrow();
      const description = new Description('This is a minimum length description.');
      expect(description.getValue()).toBe('This is a minimum length description.');
    });

    it('should handle typical medical descriptions', () => {
      // Simple descriptions
      expect(() => new Description('Take one tablet daily with food.')).not.toThrow();
      expect(() => new Description('Apply cream to affected area twice daily.')).not.toThrow();
      // Complex descriptions
      expect(() => new Description('Administer 10mg orally every 8 hours with meals. Do not exceed 30mg per day.')).not.toThrow();
      expect(() => new Description('For patients with severe symptoms, increase dosage to 20mg twice daily. Monitor blood pressure regularly.')).not.toThrow();
    });

    it('should handle descriptions with special characters', () => {
      expect(() => new Description('Take 1-2 tablets as needed (max 6 per day).')).not.toThrow();
      expect(() => new Description('Store at 2-8°C. Do not freeze.')).not.toThrow();
      expect(() => new Description('Use with caution in patients with renal impairment (GFR < 30 mL/min).')).not.toThrow();
    });

    it('should handle multiline descriptions', () => {
      const multilineDescription = `Take one tablet daily with food.
Avoid alcohol while taking this medication.
Store in a cool, dry place.
Consult your doctor if symptoms persist.`;
      expect(() => new Description(multilineDescription)).not.toThrow();
      const description = new Description(multilineDescription);
      expect(description.getValue()).toBe(multilineDescription);
    });
  });
}); 