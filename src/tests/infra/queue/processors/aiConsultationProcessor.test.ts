import { AIConsultationProcessor } from '@/infra/queue/processors/aiConsultationProcessor';

describe('AIConsultationProcessor', () => {
  it('should be defined', () => {
    expect(AIConsultationProcessor).toBeDefined();
  });

  it('should have validateIndications method', () => {
    const processor = new AIConsultationProcessor();
    expect(processor.validateIndications).toBeDefined();
    expect(typeof processor.validateIndications).toBe('function');
  });
}); 