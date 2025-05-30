import { DrugInfo } from '@/infra/services/dailyMedApi';

export interface IDailyMedService {
  /**
   * Checks if a drug exists in DailyMed by its name
   * @param drugName The name of the drug to check
   * @returns The drug's setId if found, null otherwise
   */
  checkDrugExists(drugName: string): Promise<string | null>;

  /**
   * Extracts drug information from DailyMed
   * @param setId The DailyMed setId of the drug
   * @returns The extracted drug information
   */
  extractDrugInfo(setId: string): Promise<DrugInfo>;
} 