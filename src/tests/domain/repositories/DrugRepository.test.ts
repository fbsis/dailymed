import { DrugRepository } from '@/domain/repositories/DrugRepository';
import { Drug } from '@/domain/entities/Drug';
import { DrugName } from '@/domain/value-objects/DrugName';
import { IdentificationCode } from '@/domain/value-objects/IdentificationCode';
import { Indication } from '@/domain/entities/Indication';
import { IndicationCode } from '@/domain/value-objects/IndicationCode';
import { Condition } from '@/domain/value-objects/Condition';
import { Description } from '@/domain/value-objects/Description';
import { Dosage } from '@/domain/entities/Dosage';
import { AgeGroups } from '@/domain/entities/AgeGroups';
import { AgeBasedDosage } from '@/domain/entities/AgeBasedDosage';
import { AgeRange } from '@/domain/value-objects/AgeRange';
import { WeightRange } from '@/domain/value-objects/WeightRange';
import { DosageValue } from '@/domain/value-objects/DosageValue';

describe('DrugRepository', () => {
  let mockDrugRepository: jest.Mocked<DrugRepository>;
  let validDrug: Drug;
  const validUUID = '595f437d-2729-40bb-9c62-c8ece1f82780';

  beforeEach(() => {
    // Create a mock implementation of DrugRepository
    mockDrugRepository = {
      findByName: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    // Create a valid drug instance for testing
    const name = new DrugName('Test Drug');
    const identificationCode = new IdentificationCode(validUUID);
    const indications = [
      new Indication(
        new IndicationCode('1.1'),
        new Condition('Test Condition'),
        new Description('This is a detailed test description that meets the minimum length requirement')
      )
    ];

    const ageRange = new AgeRange(0, 12, 'years');
    const weightRange = new WeightRange(1, 12, 'kg');
    const dosageValue = new DosageValue('300 mg');
    const weightBasedDosages = new Map([[weightRange, dosageValue]]);
    const ageBasedDosage = new AgeBasedDosage(ageRange, weightBasedDosages);
    const ageGroups = new AgeGroups([ageBasedDosage]);

    const instructions = [new Description('Take this medication with a full glass of water after meals')];
    const dosage = new Dosage(instructions, ageGroups);

    validDrug = new Drug(name, identificationCode, indications, dosage);
  });

  describe('findByName', () => {
    it('should return a drug when found', async () => {
      mockDrugRepository.findByName.mockResolvedValueOnce(validDrug);

      const result = await mockDrugRepository.findByName('Test Drug');

      expect(mockDrugRepository.findByName).toHaveBeenCalledWith('Test Drug');
      expect(result).toBe(validDrug);
    });

    it('should return null when drug is not found', async () => {
      mockDrugRepository.findByName.mockResolvedValueOnce(null);

      const result = await mockDrugRepository.findByName('Non Existent Drug');

      expect(mockDrugRepository.findByName).toHaveBeenCalledWith('Non Existent Drug');
      expect(result).toBeNull();
    });

    it('should handle errors during search', async () => {
      const error = new Error('Database error');
      mockDrugRepository.findByName.mockRejectedValueOnce(error);

      await expect(mockDrugRepository.findByName('Test Drug')).rejects.toThrow('Database error');
      expect(mockDrugRepository.findByName).toHaveBeenCalledWith('Test Drug');
    });
  });

  describe('save', () => {
    it('should save a drug successfully', async () => {
      mockDrugRepository.save.mockResolvedValueOnce();

      await mockDrugRepository.save(validDrug);

      expect(mockDrugRepository.save).toHaveBeenCalledWith(validDrug);
    });

    it('should handle errors during save', async () => {
      const error = new Error('Save failed');
      mockDrugRepository.save.mockRejectedValueOnce(error);

      await expect(mockDrugRepository.save(validDrug)).rejects.toThrow('Save failed');
      expect(mockDrugRepository.save).toHaveBeenCalledWith(validDrug);
    });
  });

  describe('findAll', () => {
    it('should return an array of drugs', async () => {
      const drugs = [validDrug];
      mockDrugRepository.findAll.mockResolvedValueOnce(drugs);

      const result = await mockDrugRepository.findAll();

      expect(mockDrugRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(drugs);
    });

    it('should return an empty array when no drugs exist', async () => {
      mockDrugRepository.findAll.mockResolvedValueOnce([]);

      const result = await mockDrugRepository.findAll();

      expect(mockDrugRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should handle errors during findAll', async () => {
      const error = new Error('Find all failed');
      mockDrugRepository.findAll.mockRejectedValueOnce(error);

      await expect(mockDrugRepository.findAll()).rejects.toThrow('Find all failed');
      expect(mockDrugRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a drug successfully', async () => {
      mockDrugRepository.update.mockResolvedValueOnce();

      await mockDrugRepository.update(validDrug);

      expect(mockDrugRepository.update).toHaveBeenCalledWith(validDrug);
    });

    it('should handle errors during update', async () => {
      const error = new Error('Update failed');
      mockDrugRepository.update.mockRejectedValueOnce(error);

      await expect(mockDrugRepository.update(validDrug)).rejects.toThrow('Update failed');
      expect(mockDrugRepository.update).toHaveBeenCalledWith(validDrug);
    });
  });

  describe('delete', () => {
    it('should delete a drug successfully', async () => {
      mockDrugRepository.delete.mockResolvedValueOnce();

      await mockDrugRepository.delete('Test Drug');

      expect(mockDrugRepository.delete).toHaveBeenCalledWith('Test Drug');
    });

    it('should handle errors during delete', async () => {
      const error = new Error('Delete failed');
      mockDrugRepository.delete.mockRejectedValueOnce(error);

      await expect(mockDrugRepository.delete('Test Drug')).rejects.toThrow('Delete failed');
      expect(mockDrugRepository.delete).toHaveBeenCalledWith('Test Drug');
    });
  });
}); 