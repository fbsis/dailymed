import { DailyMedProcessor } from '@/infra/queue/processors/dailyMedProcessor';

describe('DailyMedProcessor', () => {
  it('should be defined', () => {
    expect(DailyMedProcessor).toBeDefined();
  });

  it('should have checkDrugExists method', () => {
    const processor = new DailyMedProcessor();
    expect(processor.checkDrugExists).toBeDefined();
    expect(typeof processor.checkDrugExists).toBe('function');
  });

  it('should have extractDrugInfo method', () => {
    const processor = new DailyMedProcessor();
    expect(processor.extractDrugInfo).toBeDefined();
    expect(typeof processor.extractDrugInfo).toBe('function');
  });
}); 