import { RedisCacheService } from '@/infra/cache/RedisCacheService';
import Redis from 'ioredis';
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

jest.mock('ioredis');

describe('RedisCacheService', () => {
  let cacheService: RedisCacheService;
  let mockRedis: jest.Mocked<Redis>;
  const validUUID = '595f437d-2729-40bb-9c62-c8ece1f82780';

  beforeEach(() => {
    mockRedis = {
      get: jest.fn(),
      set: jest.fn(),
      setex: jest.fn(),
      del: jest.fn(),
      quit: jest.fn()
    } as unknown as jest.Mocked<Redis>;

    (Redis as jest.MockedClass<typeof Redis>).mockImplementation(() => mockRedis);
    cacheService = new RedisCacheService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDrug', () => {
    it('should return cached drug when it exists', async () => {
      const drugName = 'test-drug';
      const ageRange = new AgeRange(18, 65, 'years');
      const weightRange = new WeightRange(50, 100, 'kg');
      const dosageValue = new DosageValue('300 mg');
      const weightBasedDosages = new Map([[weightRange, dosageValue]]);
      const ageBasedDosage = new AgeBasedDosage(ageRange, weightBasedDosages);
      const ageGroups = new AgeGroups([ageBasedDosage]);
      const instructions = [new Description('Take with food')];
      const dosage = new Dosage(instructions, ageGroups);
      const drug = new Drug(
        new DrugName('Test Drug'),
        new IdentificationCode(validUUID),
        [new Indication(new IndicationCode('1.1'), new Condition('Test Condition'), new Description('Test Description'))],
        dosage
      );
      const cachedValue = JSON.stringify({
        name: drug.getName().getValue(),
        identificationCode: drug.getIdentificationCode().getValue(),
        indications: drug.getIndications().map(i => ({
          code: i.getCode().getValue(),
          condition: i.getCondition().getValue(),
          description: i.getDescription().getValue()
        })),
        dosage: {
          value: drug.getDosage().getImportantAdministrationInstructions()[0].getValue(),
          unit: 'mg'
        }
      });
      mockRedis.get.mockResolvedValue(cachedValue);

      await cacheService.getDrug(drugName);

      expect(mockRedis.get).toHaveBeenCalledWith(`drug:${drugName.toLowerCase()}`);
    });

    it('should return null when cache miss', async () => {
      const drugName = 'test-drug';
      mockRedis.get.mockResolvedValue(null);

      const result = await cacheService.getDrug(drugName);

      expect(mockRedis.get).toHaveBeenCalledWith(`drug:${drugName.toLowerCase()}`);
      expect(result).toBeNull();
    });

    it('should handle JSON parse errors', async () => {
      const drugName = 'test-drug';
      mockRedis.get.mockResolvedValue('invalid-json');

      const result = await cacheService.getDrug(drugName);

      expect(mockRedis.get).toHaveBeenCalledWith(`drug:${drugName.toLowerCase()}`);
      expect(result).toBeNull();
    });

    it('should handle Redis errors', async () => {
      const drugName = 'test-drug';
      mockRedis.get.mockRejectedValue(new Error('Redis error'));

      await expect(cacheService.getDrug(drugName)).rejects.toThrow('Redis error');
      expect(mockRedis.get).toHaveBeenCalledWith(`drug:${drugName.toLowerCase()}`);
    });
  });

  describe('setDrug', () => {
    it('should set drug in cache', async () => {
      const ageRange = new AgeRange(18, 65, 'years');
      const weightRange = new WeightRange(50, 100, 'kg');
      const dosageValue = new DosageValue('300 mg');
      const weightBasedDosages = new Map([[weightRange, dosageValue]]);
      const ageBasedDosage = new AgeBasedDosage(ageRange, weightBasedDosages);
      const ageGroups = new AgeGroups([ageBasedDosage]);
      const instructions = [new Description('Take with food')];
      const dosage = new Dosage(instructions, ageGroups);
      const drug = new Drug(
        new DrugName('Test Drug'),
        new IdentificationCode(validUUID),
        [new Indication(new IndicationCode('1.1'), new Condition('Test Condition'), new Description('Test Description'))],
        dosage
      );

      await cacheService.setDrug(drug);

      expect(mockRedis.setex).toHaveBeenCalledWith(
        `drug:${drug.getName().getValue().toLowerCase()}`,
        3600,
        expect.any(String)
      );
    });

    it('should handle Redis errors', async () => {
      const ageRange = new AgeRange(18, 65, 'years');
      const weightRange = new WeightRange(50, 100, 'kg');
      const dosageValue = new DosageValue('300 mg');
      const weightBasedDosages = new Map([[weightRange, dosageValue]]);
      const ageBasedDosage = new AgeBasedDosage(ageRange, weightBasedDosages);
      const ageGroups = new AgeGroups([ageBasedDosage]);
      const instructions = [new Description('Take with food')];
      const dosage = new Dosage(instructions, ageGroups);
      const drug = new Drug(
        new DrugName('Test Drug'),
        new IdentificationCode(validUUID),
        [new Indication(new IndicationCode('1.1'), new Condition('Test Condition'), new Description('Test Description'))],
        dosage
      );
      mockRedis.setex.mockRejectedValue(new Error('Redis error'));

      await expect(cacheService.setDrug(drug)).rejects.toThrow('Redis error');
      expect(mockRedis.setex).toHaveBeenCalled();
    });
  });

  describe('removeDrug', () => {
    it('should remove drug from cache', async () => {
      const drugName = 'test-drug';
      mockRedis.del.mockResolvedValue(1);

      await cacheService.removeDrug(drugName);

      expect(mockRedis.del).toHaveBeenCalledWith(`drug:${drugName.toLowerCase()}`);
    });

    it('should handle Redis errors', async () => {
      const drugName = 'test-drug';
      const error = new Error('Redis error');
      mockRedis.del.mockRejectedValue(error);

      await expect(cacheService.removeDrug(drugName)).rejects.toThrow(error);
      expect(mockRedis.del).toHaveBeenCalledWith(`drug:${drugName.toLowerCase()}`);
    });
  });
});