import { Request, Response, NextFunction } from "express";
import { DrugNotFoundError } from "@/domain/errors/DrugNotFoundError";

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(err.stack);

  if (err instanceof DrugNotFoundError) {
    res.status(404).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "error",
    message: err.message || "Something broke!",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
};
