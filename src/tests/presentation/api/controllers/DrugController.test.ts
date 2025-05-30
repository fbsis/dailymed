import { DrugController } from '@/presentation/api/controllers/DrugController';
import { DrugRepository } from '@/domain/repositories/DrugRepository';

describe('DrugController', () => {
  let mockDrugRepository: jest.Mocked<DrugRepository>;
  let drugController: DrugController;

  beforeEach(() => {
    mockDrugRepository = {
      findByName: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    drugController = new DrugController(mockDrugRepository);
  });

  it('should be defined', () => {
    expect(DrugController).toBeDefined();
  });

  it('should have all required methods', () => {
    expect(drugController.findAll).toBeDefined();
    expect(drugController.findByName).toBeDefined();
    expect(drugController.save).toBeDefined();
    expect(drugController.update).toBeDefined();
    expect(drugController.delete).toBeDefined();
  });

  it('should call repository methods', async () => {
    await drugController.findAll();
    expect(mockDrugRepository.findAll).toHaveBeenCalled();

    await drugController.findByName('Test Drug');
    expect(mockDrugRepository.findByName).toHaveBeenCalledWith('Test Drug');

    const drugData = {
      name: 'Test Drug',
      identificationCode: '595f437d-2729-40bb-9c62-c8ece1f82780',
      indications: [{
        code: '1.1',
        description: 'This is a detailed test description that meets the minimum length requirement'
      }],
      dosage: {
        value: '300 mg',
        unit: 'mg'
      }
    };

    await drugController.save(drugData);
    expect(mockDrugRepository.save).toHaveBeenCalled();

    await drugController.update(drugData);
    expect(mockDrugRepository.update).toHaveBeenCalled();

    await drugController.delete('Test Drug');
    expect(mockDrugRepository.delete).toHaveBeenCalledWith('Test Drug');
  });
}); 