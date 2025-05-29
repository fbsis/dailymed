import { Indication } from '../entities/Indication';

export interface IAIConsultationService {
  /**
   * Validates and potentially enriches drug indications using AI
   * @param indications The list of indications to validate
   * @returns The validated and potentially enriched indications
   */
  validateIndications(indications: Indication[]): Promise<Indication[]>;
} 