import { Request, Response, NextFunction } from 'express';
import { validate, validateQueryParams, createDrugSchema, updateDrugSchema, queryParamsSchema } from '../middleware/validation';

describe('Validation Middleware', () => {
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

    it('should pass validation for valid update drug data', async () => {
      // Arrange
      mockRequest.body = { name: 'Updated Drug' };
      const validateMiddleware = validate(updateDrugSchema);

      // Act
      await validateMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should pass validation for empty update drug data', async () => {
      // Arrange
      mockRequest.body = {};
      const validateMiddleware = validate(updateDrugSchema);

      // Act
      await validateMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
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
      expect(mockRequest.validatedQuery).toEqual({
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
      expect(mockRequest.validatedQuery).toEqual({
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

    it('should fail validation for invalid limit parameter', async () => {
      // Arrange
      mockRequest.query = {
        page: '1',
        limit: 'invalid'
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
            path: 'limit',
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