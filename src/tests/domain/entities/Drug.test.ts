import { Drug } from '@/domain/entities/Drug';
import { DrugName } from '@/domain/value-objects/DrugName';
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
import { IdentificationCode } from '@/domain/value-objects/IdentificationCode';

describe('Drug', () => {
  let name: DrugName;
  let identificationCode: IdentificationCode;
  let indications: Indication[];
  let dosage: Dosage;
  let ageGroups: AgeGroups;
  let ageBasedDosage: AgeBasedDosage;
  let weightBasedDosages: Map<WeightRange, DosageValue>;

  beforeEach(() => {
    name = new DrugName('Dupixent');
    identificationCode = new IdentificationCode('595f437d-2729-40bb-9c62-c8ece1f82780');

    const code = new IndicationCode('1.1');
    const condition = new Condition('Atopic Dermatitis');
    const description = new Description('Dupixent is indicated for the treatment of adult and pediatric patients aged 6 months and older with moderate-to-severe atopic dermatitis (AD) whose disease is not adequately controlled with topical prescription therapies or when those therapies are not advisable.');
    indications = [new Indication(code, condition, description)];

    const ageRange = new AgeRange(0, 12, 'years');
    const weightRange = new WeightRange(5, 10, 'kg');
    const dosageValue = new DosageValue('300 mg');
    weightBasedDosages = new Map([[weightRange, dosageValue]]);
    ageBasedDosage = new AgeBasedDosage(ageRange, weightBasedDosages);
    ageGroups = new AgeGroups([ageBasedDosage]);

    const instructions = [
      new Description('Dupixent is administered by subcutaneous injection.'),
      new Description('Administer each of the two DUPIXENT 300 mg injections at different injection sites for initial doses.')
    ];
    dosage = new Dosage(instructions, ageGroups);
  });

  describe('instantiation', () => {
    it('should exist', () => {
      expect(Drug).toBeDefined();
    });

    it('should be instantiable with valid parameters', () => {
      const drug = new Drug(name, identificationCode, indications, dosage);
      expect(drug).toBeInstanceOf(Drug);
    });
  });

  describe('getters', () => {
    it('should return correct name', () => {
      const drug = new Drug(name, identificationCode, indications, dosage);
      expect(drug.getName()).toBe(name);
    });

    it('should return correct indications', () => {
      const drug = new Drug(name, identificationCode, indications, dosage);
      const returnedIndications = drug.getIndications();
      expect(returnedIndications).toHaveLength(1);
      expect(returnedIndications[0]).toBe(indications[0]);
    });

    it('should return correct dosage', () => {
      const drug = new Drug(name, identificationCode, indications, dosage);
      expect(drug.getDosage()).toBe(dosage);
    });
  });
}); 