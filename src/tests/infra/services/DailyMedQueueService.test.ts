import { DailyMedQueueService } from '@/infra/services/DailyMedQueueService';

describe('DailyMedQueueService', () => {
  it('should be defined', () => {
    expect(DailyMedQueueService).toBeDefined();
  });

  it('should have checkDrugExists method', () => {
    const service = new DailyMedQueueService();
    expect(service.checkDrugExists).toBeDefined();
    expect(typeof service.checkDrugExists).toBe('function');
  });

  it('should have extractDrugInfo method', () => {
    const service = new DailyMedQueueService();
    expect(service.extractDrugInfo).toBeDefined();
    expect(typeof service.extractDrugInfo).toBe('function');
  });
}); 