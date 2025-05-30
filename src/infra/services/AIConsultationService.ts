import { IAIConsultationService } from '@/domain/protocols/IAIConsultationService';
import { AIConsultationProcessor, DrugInfo } from '../queue/processors/aiConsultationProcessor';
import { DrugMapper } from '../mappers/DrugMapper';
import { Drug } from '@/domain/entities/Drug';
import { IDrugDocument } from '../models/DrugModel';

export class AIConsultationService implements IAIConsultationService {
  private processor: AIConsultationProcessor;

  constructor() {
    this.processor = new AIConsultationProcessor();
  }

  private stripHtmlTags(html: string): string {
    // Remove HTML comments
    let text = html.replace(/<!--[\s\S]*?-->/g, '');
    
    // Remove script and style tags and their contents
    text = text.replace(/<script[\s\S]*?<\/script>/gi, '');
    text = text.replace(/<style[\s\S]*?<\/style>/gi, '');
    
    // Replace common HTML entities
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&quot;/g, '"');
    text = text.replace(/&#39;/g, "'");
    
    // Remove all HTML tags
    text = text.replace(/<[^>]*>/g, '');
    
    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    // Remove multiple newlines
    text = text.replace(/\n\s*\n/g, '\n');
    
    return text;
  }

  async validateIndications(html: string): Promise<Drug> {
    try {
      // Clean HTML
      const cleanText = this.stripHtmlTags(html);
      
      // Extract drug info from cleaned text
      const drugInfo = await this.processor.extractDrugInfo(cleanText);
      
      // Convert to domain model
      const drug = this.mapToDomain(drugInfo);
      return drug;
      
    } catch (error) {
      console.error('Error validating indications:', error);
      throw new Error('Failed to validate indications');
    }
  }

  private mapToDomain(drugInfo: DrugInfo): Drug {
    const doc: Partial<IDrugDocument> = {
      name: drugInfo.name,
      identificationCode: drugInfo.identificationCode,
      indications: drugInfo.indications.map(ind => ({
        code: ind.code,
        description: ind.description
      })),
      dosage: {
        value: drugInfo.dosage.value,
        unit: drugInfo.dosage.unit
      }
    };

    // Use DrugMapper to convert to domain model
    return DrugMapper.toDomain(doc as IDrugDocument);
  }
} 