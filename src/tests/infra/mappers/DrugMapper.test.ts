import { DrugMapper } from '@/infra/mappers/DrugMapper';
import { Drug } from '@/domain/entities/Drug';
import { DrugModel } from '@/infra/models/DrugModel';
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
import { IDrugDocument } from '@/infra/models/DrugModel';
import mongoose from 'mongoose';

describe('DrugMapper', () => {
  const validUUID = '595f437d-2729-40bb-9c62-c8ece1f82780';

  it('should be defined', () => {
    expect(DrugMapper).toBeDefined();
  });

  it('should have toDomain method', () => {
    expect(DrugMapper.toDomain).toBeDefined();
    expect(typeof DrugMapper.toDomain).toBe('function');
  });

  it('should have toPersistence method', () => {
    expect(DrugMapper.toPersistence).toBeDefined();
    expect(typeof DrugMapper.toPersistence).toBe('function');
  });

  describe('toDomain', () => {
    it('should convert DrugModel to Drug entity', () => {
      const drugModel = {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
        name: 'Test Drug',
        identificationCode: validUUID,
        indications: [
          {
            code: '1.1',
            description: 'This is a detailed test description for the condition that meets the minimum length requirement for the description field in the database'
          }
        ],
        dosage: {
          value: '300 mg',
          unit: 'mg'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      } as unknown as IDrugDocument;

      const result = DrugMapper.toDomain(drugModel);

      expect(result).toBeInstanceOf(Drug);
      expect(result.getName().getValue()).toBe(drugModel.name);
      expect(result.getIdentificationCode().getValue()).toBe(drugModel.identificationCode);
      
      const indications = result.getIndications();
      expect(indications).toHaveLength(1);
      expect(indications[0].getCode().getValue()).toBe(drugModel.indications[0].code);
      expect(indications[0].getDescription().getValue()).toBe(drugModel.indications[0].description);
      
      const dosage = result.getDosage();
      expect(dosage.getImportantAdministrationInstructions()[0].getValue()).toBe(drugModel.dosage.value);
      expect(dosage.getAgeGroups().getAllAgeBasedDosages()[0].getAgeRange().toString()).toBe('0 to 12 years');
    });

    it('should handle null values in optional fields', () => {
      const drugModel = {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
        name: 'Test Drug',
        identificationCode: validUUID,
        indications: [],
        dosage: {
          value: '300 mg',
          unit: 'mg'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      } as unknown as IDrugDocument;

      const result = DrugMapper.toDomain(drugModel);

      expect(result).toBeInstanceOf(Drug);
      expect(result.getIndications()).toHaveLength(0);
      expect(result.getDosage().getImportantAdministrationInstructions()).toHaveLength(1);
    });
  });

  describe('toPersistence', () => {
    it('should convert Drug entity to DrugModel', () => {
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

      const drug = new Drug(name, identificationCode, indications, dosage);

      const result = DrugMapper.toPersistence(drug);

      expect(result).toEqual({
        name: drug.getName().getValue(),
        identificationCode: drug.getIdentificationCode().getValue(),
        indications: drug.getIndications().map(indication => ({
          code: indication.getCode().getValue(),
          description: indication.getDescription().getValue()
        })),
        dosage: {
          value: 'Take this medication with a full glass of water after meals',
          unit: 'this'
        }
      });
    });

    it('should handle null values in optional fields', () => {
      const name = new DrugName('Test Drug');
      const identificationCode = new IdentificationCode(validUUID);
      const indications: Indication[] = [];

      const ageRange = new AgeRange(0, 12, 'years');
      const weightRange = new WeightRange(1, 12, 'kg');
      const dosageValue = new DosageValue('300 mg');
      const weightBasedDosages = new Map([[weightRange, dosageValue]]);
      const ageBasedDosage = new AgeBasedDosage(ageRange, weightBasedDosages);
      const ageGroups = new AgeGroups([ageBasedDosage]);

      const instructions: Description[] = [];
      const dosage = new Dosage(instructions, ageGroups);

      const drug = new Drug(name, identificationCode, indications, dosage);

      const result = DrugMapper.toPersistence(drug);

      expect(result).toEqual({
        name: drug.getName().getValue(),
        identificationCode: drug.getIdentificationCode().getValue(),
        indications: [],
        dosage: {
          value: '300 mg',
          unit: 'mg'
        }
      });
    });
  });
}); 