import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';

// Value Objects
const DrugNameSchema = z.string().min(1, 'Drug name is required');
const IdentificationCodeSchema = z.string().regex(/^[A-Z0-9-]+$/, 'Invalid identification code format');

// Entities
const IndicationSchema = z.object({
  code: z.string().regex(/^\d+\.\d+$/, 'Invalid indication code format'),
  description: z.string().min(10, 'Description must be at least 10 characters')
});

const DosageSchema = z.object({
  value: z.string().min(1, 'Dosage value is required'),
  unit: z.enum(['mg', 'g'], { errorMap: () => ({ message: 'Unit must be mg or g' }) })
});

export const DrugInfoSchema = z.object({
  name: DrugNameSchema,
  identificationCode: IdentificationCodeSchema,
  indications: z.array(IndicationSchema),
  dosage: DosageSchema
});

export type DrugInfo = z.infer<typeof DrugInfoSchema>;

export interface AIConsultationResult {
  validatedIndications: string[];
}

export class AIConsultationProcessor {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async extractDrugInfo(text: string): Promise<DrugInfo> {
    try {
      const response = await this.openai.responses.parse({
        model: 'gpt-4o',
        input: [
          {
            role: 'system',
            content: `You are a medical information extraction assistant. 
            Extract structured information about drug from the provided text.
            Focus on extracting:
            1. Drug name (required, must be a valid string)
            2. Identification code (is the setId from DailyMed)
            3. Indications with:
               - Code (required, must be in format: number.number, e.g., 1.1, using ICD-10)
               - Description (required, must be at least 10 characters)
            4. Dosage information:
               - Value (required, must include the number and unit(mg or g), e.g., "300 mg")
               - Unit (must be either "mg" or "g")
            Use ICD-10 codes for diagnosis and procedure codes for procedures.
            Only include information that is explicitly stated in the text.
            Format the output according to the provided schema.
            For dosage, extract the most common or primary dosage value.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        text: {
          format: zodTextFormat(DrugInfoSchema, 'drug_info')
        }
      });

      const parsed = response.output_parsed;
      console.log(parsed);
      if (!parsed) {
        throw new Error('Empty AI response');
      }

      // Validate the parsed response against our schema
      return DrugInfoSchema.parse(parsed);
    } catch (error) {
      console.error('Error extracting drug info:', error);
      
      // If it's a Zod validation error, propagate the specific error message
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        throw new Error(firstError.message);
      }

      // For any other error (API errors, etc), throw the generic error
      throw new Error('Failed to extract drug information');
    }
  }

  async validateIndications(indications: string[]): Promise<AIConsultationResult> {
    return {
      validatedIndications: indications.filter(indication =>
        indication.length > 0 && indication.length <= 200
      )
    };
  }
} 