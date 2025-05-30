import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';

// Value Objects
const DrugNameSchema = z.string().min(1, 'Drug name is required');
const IdentificationCodeSchema = z.string().regex(/^[A-Z0-9-]+$/, 'Invalid identification code format');

// Entities
const IndicationSchema = z.object({
  code: z.string().regex(/^\d+\.\d+$/, 'Invalid indication code format'),
  condition: z.string().min(1, 'Condition is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  limitations: z.string().nullable()
});

const DosageAgeGroupSchema = z.object({
  initialDosage: z.string().nullable(),
  subsequentDosage: z.string().nullable(),
  '200 mg': z.string().nullable(),
  '15_to_30_kg': z.string().nullable(),
  '30_kg_and_above': z.string().nullable(),
  '30_to_60_kg': z.object({
    initialLoadingDose: z.string(),
    subsequentDosage: z.string()
  }).nullable(),
  '60_kg_and_above': z.object({
    initialLoadingDose: z.string(),
    subsequentDosage: z.string()
  }).nullable()
});

const DosageSchema = z.object({
  importantAdministrationInstructions: z.array(z.string()),
  ageGroups: z.object({
    adults: DosageAgeGroupSchema,
    pediatric_6_months_to_5_years: DosageAgeGroupSchema,
    pediatric_6_to_11_years: DosageAgeGroupSchema,
    pediatric_12_to_17_years: DosageAgeGroupSchema
  })
});

// Main Schema
const DrugInfoSchema = z.object({
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
        model: 'gpt-4-turbo-preview',
        input: [
          {
            role: 'system',
            content: `You are a medical information extraction assistant. 
            Extract structured information about drug from the provided text.
            Focus on extracting:
            1. Drug name (required, must be a valid string)
            2. Identification code (required, must be in format: uppercase letters, numbers, and hyphens only)
            3. Indications with:
               - Code (required, must be in format: number.number, e.g., 1.1)
               - Condition (required, must be a non-empty string)
               - Description (required, must be at least 10 characters)
               - Limitations (optional)
            4. Dosage information including:
               - Important administration instructions
               - Age-specific dosage for adults and different pediatric groups
            Only include information that is explicitly stated in the text.
            Format the output according to the provided schema.`
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