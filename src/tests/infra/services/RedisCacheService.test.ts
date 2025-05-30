import { RedisCacheService } from "@/infra/cache/RedisCacheService";

describe('RedisCacheService', () => {
  it('should be defined', () => {
    expect(RedisCacheService).toBeDefined();
  });

  it('should have get method', () => {
    const service = new RedisCacheService();
    expect(service.getDrug).toBeDefined();
    expect(typeof service.getDrug).toBe('function');
  });

  it('should have set method', () => {
    const service = new RedisCacheService();
    expect(service.setDrug).toBeDefined();
    expect(typeof service.setDrug).toBe('function');
  });

  it('should have delete method', () => {
    const service = new RedisCacheService();
    expect(service.removeDrug).toBeDefined();
    expect(typeof service.removeDrug).toBe('function');
  });
}); 