import { Request, Response, NextFunction, RequestHandler } from "express";
import { z } from "zod";

// Create Drug validation schema
export const createDrugSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

// Update Drug validation schema
export const updateDrugSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
});

// Query parameters validation schema
export const queryParamsSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default("1"),
  limit: z.string().regex(/^\d+$/).transform(Number).default("10"),
  search: z.string().optional(),
});

// Types inferred from schemas
export type CreateDrugInput = z.infer<typeof createDrugSchema>;
export type UpdateDrugInput = z.infer<typeof updateDrugSchema>;
export type QueryParams = z.infer<typeof queryParamsSchema>;

// Extend Express Request type to include validated query params
declare global {
  namespace Express {
    interface Request {
      validatedQuery?: QueryParams;
    }
  }
}

// Validation middleware factory
export const validate = (schema: z.ZodSchema): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
};

// Query params validation middleware
export const validateQueryParams: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedParams = await queryParamsSchema.parseAsync(req.query);
    // Store validated params in a new property
    req.validatedQuery = validatedParams;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        status: "error",
        message: "Invalid query parameters",
        errors: error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
      return;
    }
    next(error);
  }
};
