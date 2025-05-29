import { Dosage } from '@/domain/entities/Dosage';
import { Description } from '@/domain/value-objects/Description';
import { AgeGroups } from '@/domain/entities/AgeGroups';
import { AgeBasedDosage } from '@/domain/entities/AgeBasedDosage';
import { AgeRange } from '@/domain/value-objects/AgeRange';
import { WeightRange } from '@/domain/value-objects/WeightRange';
import { DosageValue } from '@/domain/value-objects/DosageValue';

describe('Dosage', () => {
  let importantInstructions: Description[];
  let ageGroups: AgeGroups;
  let dosage: Dosage;

  beforeEach(() => {
    // Setup AgeGroups
    const ageRange = new AgeRange(0, 12, 'years');
    const weightRange = new WeightRange(5, 10, 'kg');
    const dosageValue = new DosageValue('300 mg');
    const weightBasedDosages = new Map([[weightRange, dosageValue]]);
    const ageBasedDosage = new AgeBasedDosage(ageRange, weightBasedDosages);
    ageGroups = new AgeGroups([ageBasedDosage]);

    // Setup Instructions
    importantInstructions = [
      new Description('Take with food to minimize gastrointestinal side effects.'),
      new Description('Swallow tablets whole; do not crush or chew.')
    ];

    dosage = new Dosage(importantInstructions, ageGroups);
  });

  describe('getImportantAdministrationInstructions', () => {
    it('should exist', () => {
      expect(dosage.getImportantAdministrationInstructions).toBeDefined();
    });

    it('should return all instructions', () => {
      const instructions = dosage.getImportantAdministrationInstructions();
      expect(instructions).toHaveLength(2);
      expect(instructions[0].getValue()).toBe('Take with food to minimize gastrointestinal side effects.');
      expect(instructions[1].getValue()).toBe('Swallow tablets whole; do not crush or chew.');
    });

    it('should return empty array when no instructions provided', () => {
      const emptyDosage = new Dosage([], ageGroups);
      const instructions = emptyDosage.getImportantAdministrationInstructions();
      expect(instructions).toHaveLength(0);
    });

    it('should maintain instruction order', () => {
      const instructions = dosage.getImportantAdministrationInstructions();
      expect(instructions[0].getValue()).toBe('Take with food to minimize gastrointestinal side effects.');
      expect(instructions[1].getValue()).toBe('Swallow tablets whole; do not crush or chew.');
    });

    it('should handle single instruction', () => {
      const singleInstruction = [new Description('Take with food.')];
      const singleDosage = new Dosage(singleInstruction, ageGroups);
      const instructions = singleDosage.getImportantAdministrationInstructions();
      
      expect(instructions).toHaveLength(1);
      expect(instructions[0].getValue()).toBe('Take with food.');
    });
  });

  describe('getAgeGroups', () => {
    it('should exist', () => {
      expect(dosage.getAgeGroups).toBeDefined();
    });

    it('should return the age groups instance', () => {
      expect(dosage.getAgeGroups()).toBe(ageGroups);
    });

    it('should return age groups with valid age range', () => {
      const groups = dosage.getAgeGroups();
      const dosageForAge = groups.getDosageForAgeAndWeight(6, 'years', 7);
      expect(dosageForAge.getAgeRange()?.getMinAge()).toBe(0);
      expect(dosageForAge.getAgeRange()?.getMaxAge()).toBe(12);
    });
  });

  describe('getImportantAdministrationInstructions - additional tests', () => {
    it('should handle multiple instructions with different content', () => {
      const multipleInstructions = [
        new Description('Take with food.'),
        new Description('Avoid alcohol.'),
        new Description('Store in a cool place.')
      ];
      const multiDosage = new Dosage(multipleInstructions, ageGroups);
      const instructions = multiDosage.getImportantAdministrationInstructions();
      
      expect(instructions).toHaveLength(3);
      expect(instructions[0].getValue()).toBe('Take with food.');
      expect(instructions[1].getValue()).toBe('Avoid alcohol.');
      expect(instructions[2].getValue()).toBe('Store in a cool place.');
    });

    it('should handle instructions with special characters', () => {
      const specialInstructions = [
        new Description('Take 1-2 tablets daily.'),
        new Description('Use with caution if < 18 years old.')
      ];
      const specialDosage = new Dosage(specialInstructions, ageGroups);
      const instructions = specialDosage.getImportantAdministrationInstructions();
      
      expect(instructions).toHaveLength(2);
      expect(instructions[0].getValue()).toBe('Take 1-2 tablets daily.');
      expect(instructions[1].getValue()).toBe('Use with caution if < 18 years old.');
    });
  });

  describe('getAgeGroups - additional tests', () => {
    it('should handle multiple age ranges', () => {
      const ageRange1 = new AgeRange(0, 12, 'years');
      const ageRange2 = new AgeRange(12, 17, 'years');
      const weightRange = new WeightRange(5, 10, 'kg');
      const dosageValue = new DosageValue('300 mg');
      const weightBasedDosages = new Map([[weightRange, dosageValue]]);
      
      const ageBasedDosage1 = new AgeBasedDosage(ageRange1, weightBasedDosages);
      const ageBasedDosage2 = new AgeBasedDosage(ageRange2, weightBasedDosages);
      const multiAgeGroups = new AgeGroups([ageBasedDosage1, ageBasedDosage2]);
      
      const multiDosage = new Dosage(importantInstructions, multiAgeGroups);
      const groups = multiDosage.getAgeGroups();
      
      expect(groups.getAllAgeBasedDosages()).toHaveLength(2);
      expect(groups.getDosageForAgeAndWeight(6, 'years', 7)).toBe(ageBasedDosage1);
      expect(groups.getDosageForAgeAndWeight(14, 'years', 7)).toBe(ageBasedDosage2);
    });

    it('should handle age groups with months unit', () => {
      const monthsRange = new AgeRange(0, 12, 'months');
      const weightRange = new WeightRange(5, 10, 'kg');
      const dosageValue = new DosageValue('300 mg');
      const weightBasedDosages = new Map([[weightRange, dosageValue]]);
      
      const monthsDosage = new AgeBasedDosage(monthsRange, weightBasedDosages);
      const monthsAgeGroups = new AgeGroups([monthsDosage]);
      
      const monthsDosageObj = new Dosage(importantInstructions, monthsAgeGroups);
      const groups = monthsDosageObj.getAgeGroups();
      
      expect(groups.getDosageForAgeAndWeight(6, 'months', 7)).toBe(monthsDosage);
    });
  });
}); 