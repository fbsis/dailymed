import { Request, Response, NextFunction } from 'express';
import { 
  validate, 
  validateQueryParams, 
  createDrugSchema, 
  updateDrugSchema, 
  queryParamsSchema
} from '../validations/drugValidation';

describe('Drug Validation', () => {
  describe('Schemas', () => {
    describe('createDrugSchema', () => {
      it('should validate valid drug creation data', () => {
        const validData = { name: 'Test Drug' };
        const result = createDrugSchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(validData);
        }
      });

      it('should reject empty drug name', () => {
        const invalidData = { name: '' };
        const result = createDrugSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe('Name is required');
        }
      });

      it('should reject missing drug name', () => {
        const invalidData = {};
        const result = createDrugSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe('Required');
        }
      });
    });

    describe('updateDrugSchema', () => {
      it('should validate valid drug update data', () => {
        const validData = { name: 'Updated Drug' };
        const result = updateDrugSchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(validData);
        }
      });

      it('should accept empty object (no updates)', () => {
        const validData = {};
        const result = updateDrugSchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(validData);
        }
      });

      it('should reject empty drug name when provided', () => {
        const invalidData = { name: '' };
        const result = updateDrugSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe('Name is required');
        }
      });
    });

    describe('queryParamsSchema', () => {
      it('should validate and transform valid query parameters', () => {
        const validData = {
          page: '2',
          limit: '20',
          search: 'test'
        };
        const result = queryParamsSchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual({
            page: 2,
            limit: 20,
            search: 'test'
          });
        }
      });

      it('should use default values for missing parameters', () => {
        const validData = {};
        const result = queryParamsSchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual({
            page: 1,
            limit: 10
          });
        }
      });

      it('should reject invalid page number', () => {
        const invalidData = {
          page: 'invalid',
          limit: '10'
        };
        const result = queryParamsSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].path).toContain('page');
        }
      });

      it('should reject invalid limit number', () => {
        const invalidData = {
          page: '1',
          limit: 'invalid'
        };
        const result = queryParamsSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].path).toContain('limit');
        }
      });
    });
  });

  describe('Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
      mockRequest = {
        body: {},
        query: {}
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      nextFunction = jest.fn();
    });

    describe('validate middleware', () => {
      it('should pass validation for valid create drug data', async () => {
        // Arrange
        mockRequest.body = { name: 'Test Drug' };
        const validateMiddleware = validate(createDrugSchema);

        // Act
        await validateMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

        // Assert
        expect(nextFunction).toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).not.toHaveBeenCalled();
      });

      it('should fail validation for invalid create drug data', async () => {
        // Arrange
        mockRequest.body = { name: '' };
        const validateMiddleware = validate(createDrugSchema);

        // Act
        await validateMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

        // Assert
        expect(nextFunction).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          status: 'error',
          message: 'Validation failed',
          errors: expect.arrayContaining([
            expect.objectContaining({
              path: 'name',
              message: 'Name is required'
            })
          ])
        });
      });

    });

    describe('validateQueryParams middleware', () => {
      it('should validate and transform valid query parameters', async () => {
        // Arrange
        mockRequest.query = {
          page: '2',
          limit: '20',
          search: 'test'
        };

        // Act
        await validateQueryParams(mockRequest as Request, mockResponse as Response, nextFunction);

        // Assert
        expect(nextFunction).toHaveBeenCalled();
        expect(mockRequest.query).toEqual({
          page: 2,
          limit: 20,
          search: 'test'
        });
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).not.toHaveBeenCalled();
      });

      it('should use default values for missing query parameters', async () => {
        // Arrange
        mockRequest.query = {};

        // Act
        await validateQueryParams(mockRequest as Request, mockResponse as Response, nextFunction);

        // Assert
        expect(nextFunction).toHaveBeenCalled();
        expect(mockRequest.query).toEqual({
          page: 1,
          limit: 10
        });
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).not.toHaveBeenCalled();
      });

      it('should fail validation for invalid page parameter', async () => {
        // Arrange
        mockRequest.query = {
          page: 'invalid',
          limit: '10'
        };

        // Act
        await validateQueryParams(mockRequest as Request, mockResponse as Response, nextFunction);

        // Assert
        expect(nextFunction).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          status: 'error',
          message: 'Invalid query parameters',
          errors: expect.arrayContaining([
            expect.objectContaining({
              path: 'page',
              message: expect.any(String)
            })
          ])
        });
      });

      it('should handle non-zod errors', async () => {
        // Arrange
        const error = new Error('Unexpected error');
        jest.spyOn(queryParamsSchema, 'parseAsync').mockRejectedValueOnce(error);

        // Act
        await validateQueryParams(mockRequest as Request, mockResponse as Response, nextFunction);

        // Assert
        expect(nextFunction).toHaveBeenCalledWith(error);
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).not.toHaveBeenCalled();
      });
    });
  });
}); 