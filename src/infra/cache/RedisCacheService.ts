import { ICacheService } from '@/domain/protocols/ICacheService';
import { Drug } from '@/domain/entities/Drug';
import { createRedisClient } from '../config/redis';
import { DrugMapper } from '../mappers/DrugMapper';

export class RedisCacheService implements ICacheService {
  private readonly redis = createRedisClient();
  private readonly CACHE_TTL = 60 * 60; // 1 hour in seconds

  async getDrug(name: string): Promise<Drug | null> {
    const cachedData = await this.redis.get(`drug:${name.toLowerCase()}`);
    if (!cachedData) return null;

    try {
      const parsedData = JSON.parse(cachedData);
      return DrugMapper.toDomain(parsedData);
    } catch (error) {
      console.error('Error parsing cached drug data:', error);
      return null;
    }
  }

  async setDrug(drug: Drug): Promise<void> {
    const key = `drug:${drug.getName().getValue().toLowerCase()}`;
    const data = DrugMapper.toPersistence(drug);

    try {
      await this.redis.setex(key, this.CACHE_TTL, JSON.stringify(data));
    } catch (error) {
      console.error('Error caching drug data:', error);
    }
  }

  async removeDrug(name: string): Promise<void> {
    const key = `drug:${name.toLowerCase()}`;
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Error removing drug from cache:', error);
    }
  }
} 