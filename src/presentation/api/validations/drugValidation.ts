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

// Validation middleware factory
export const validate = (schema: z.ZodSchema) => {
  return async (req: any, res: any, next: any) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
};

// Query params validation middleware
export const validateQueryParams = async (req: any, res: any, next: any) => {
  try {
    const validatedParams = await queryParamsSchema.parseAsync(req.query);
    req.query = validatedParams;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        status: "error",
        message: "Invalid query parameters",
        errors: error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
    }
    next(error);
  }
};
