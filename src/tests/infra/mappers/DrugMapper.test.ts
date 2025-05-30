import { DrugMapper } from '@/infra/mappers/DrugMapper';

describe('DrugMapper', () => {
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
}); 