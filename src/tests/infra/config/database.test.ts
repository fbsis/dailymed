import { connectDatabase, disconnectDatabase } from '@/infra/config/database';

describe('Database Configuration', () => {
  it('should export connectDatabase function', () => {
    expect(connectDatabase).toBeDefined();
    expect(typeof connectDatabase).toBe('function');
  });

  it('should export disconnectDatabase function', () => {
    expect(disconnectDatabase).toBeDefined();
    expect(typeof disconnectDatabase).toBe('function');
  });
}); 