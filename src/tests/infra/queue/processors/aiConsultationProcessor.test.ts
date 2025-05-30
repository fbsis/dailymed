import { AIConsultationProcessor, DrugInfo } from '@/infra/queue/processors/aiConsultationProcessor';
import OpenAI from 'openai';

jest.mock('openai');

describe('AIConsultationProcessor', () => {
  let processor: AIConsultationProcessor;
  let mockOpenAI: jest.Mocked<OpenAI>;

  beforeEach(() => {
    // Mock console.error to prevent error logs during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Create a more complete mock of the OpenAI client
    mockOpenAI = {
      responses: {
        parse: jest.fn()
      }
    } as unknown as jest.Mocked<OpenAI>;

    // Mock the OpenAI constructor to return our mock instance
    (OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => mockOpenAI);
    processor = new AIConsultationProcessor();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('extractDrugInfo', () => {
    const mockDrugText = `
      DRUG NAME
      Dupixent

      IDENTIFICATION CODE
      DUP-2024-001

      INDICATIONS AND USAGE
      1.1 Atopic Dermatitis
      Dupixent is indicated for the treatment of adult and pediatric patients aged 6 months and older with moderate-to-severe atopic dermatitis (AD) whose disease is not adequately controlled with topical prescription therapies or when those therapies are not advisable.

      1.2 Asthma
      Dupixent is indicated as an add-on maintenance treatment of adult and pediatric patients aged 6 years and older with moderate-to-severe asthma characterized by an eosinophilic phenotype or with oral corticosteroid dependent asthma.
      Limitations: Dupixent is not indicated for the relief of acute bronchospasm or status asthmaticus.

      DOSAGE AND ADMINISTRATION
      Important Administration Instructions:
      - Dupixent is administered by subcutaneous injection.
      - Administer each of the two DUPIXENT 300 mg injections at different injection sites for initial doses.

      Age Groups:
      Adults:
      - Initial Dosage: 600 mg (two 300 mg injections)
      - Subsequent Dosage: 300 mg every 2 weeks (Q2W)

      Pediatric 6 months to 5 years:
      - 200 mg (one 200 mg injection) every 4 weeks (Q4W)

      Pediatric 6 to 11 years:
      - 15 to 30 kg: 300 mg every 4 weeks (Q4W)
      - 30 kg and above: 200 mg every 2 weeks (Q2W)

      Pediatric 12 to 17 years:
      - 30 to 60 kg:
        * Initial Loading Dose: 400 mg (two 200 mg injections)
        * Subsequent Dosage: 200 mg every 2 weeks (Q2W)
      - 60 kg and above:
        * Initial Loading Dose: 600 mg (two 300 mg injections)
        * Subsequent Dosage: 300 mg every 2 weeks (Q2W)
    `;

    const mockAIResponse: DrugInfo = {
      name: 'Dupixent',
      identificationCode: 'DUP-2024-001',
      indications: [
        {
          code: '1.1',
          description: 'Dupixent is indicated for the treatment of adult and pediatric patients aged 6 months and older with moderate-to-severe atopic dermatitis (AD) whose disease is not adequately controlled with topical prescription therapies or when those therapies are not advisable.'
        },
        {
          code: '1.2',
          description: 'Dupixent is indicated as an add-on maintenance treatment of adult and pediatric patients aged 6 years and older with moderate-to-severe asthma characterized by an eosinophilic phenotype or with oral corticosteroid dependent asthma.'
        }
      ],
      dosage: {
        value: '300 mg',
        unit: 'mg' as const
      }
    };

    it('should extract structured information from drug text', async () => {
      const mockResponse = {
        output_parsed: mockAIResponse
      };

      (mockOpenAI.responses.parse as jest.Mock).mockResolvedValue(mockResponse);

      const result = await processor.extractDrugInfo(mockDrugText);

      expect(result).toEqual(mockAIResponse);
    });

    it('should handle empty text', async () => {
      const emptyResponse = {
        output_parsed: {
          name: '',
          identificationCode: '',
          indications: [],
          dosage: {
            importantAdministrationInstructions: [],
            ageGroups: {
              adults: {},
              pediatric_6_months_to_5_years: {},
              pediatric_6_to_11_years: {},
              pediatric_12_to_17_years: {}
            }
          }
        }
      };

      (mockOpenAI.responses.parse as jest.Mock).mockResolvedValue(emptyResponse);

      await expect(processor.extractDrugInfo(''))
        .rejects
        .toThrow('Drug name is required');

      expect(mockOpenAI.responses.parse).toHaveBeenCalled();
    });

    it('should throw error when OpenAI API fails', async () => {
      // Test with different types of API errors
      const apiErrors = [
        new Error('API Error'),
        new Error('Network Error'),
        new Error('Rate limit exceeded'),
        { message: 'Invalid API key' }
      ];

      for (const error of apiErrors) {
        (mockOpenAI.responses.parse as jest.Mock).mockRejectedValue(error);

        await expect(processor.extractDrugInfo(mockDrugText))
          .rejects
          .toThrow('Failed to extract drug information');

        expect(mockOpenAI.responses.parse).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith('Error extracting drug info:', error);
        
        // Clear mocks for next iteration
        jest.clearAllMocks();
      }
    });

    it('should throw error when response is invalid', async () => {
      const invalidResponse = {
        output_parsed: {
          name: 'Dupixent',
          identificationCode: 'invalid code', // Should be uppercase with hyphens
          indications: [],
          dosage: {
            importantAdministrationInstructions: [],
            ageGroups: {
              adults: {},
              pediatric_6_months_to_5_years: {},
              pediatric_6_to_11_years: {},
              pediatric_12_to_17_years: {}
            }
          }
        }
      };

      (mockOpenAI.responses.parse as jest.Mock).mockResolvedValue(invalidResponse);

      await expect(processor.extractDrugInfo(mockDrugText))
        .rejects
        .toThrow('Invalid identification code format');

      expect(mockOpenAI.responses.parse).toHaveBeenCalled();
    });
  });
}); 