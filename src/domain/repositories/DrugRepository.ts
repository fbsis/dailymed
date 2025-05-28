import { Drug } from '../entities/Drug';

export interface DrugRepository {
  findByName(name: string): Promise<Drug | null>;
  save(drug: Drug): Promise<void>;
  findAll(): Promise<Drug[]>;
  update(drug: Drug): Promise<void>;
  delete(name: string): Promise<void>;
} 