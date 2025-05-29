import { Drug } from '../entities/Drug';

export interface ICacheService {
  /**
   * Gets a drug from cache by its name
   * @param drugName The name of the drug to retrieve
   * @returns The cached drug if found, null otherwise
   */
  getDrug(drugName: string): Promise<Drug | null>;

  /**
   * Stores a drug in cache
   * @param drug The drug to store
   */
  setDrug(drug: Drug): Promise<void>;

  /**
   * Removes a drug from cache
   * @param drugName The name of the drug to remove
   */
  removeDrug(drugName: string): Promise<void>;
} 