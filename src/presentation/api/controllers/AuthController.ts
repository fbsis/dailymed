import { Request, Response } from 'express';
import { AuthService } from '@/infra/services/AuthService';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'normal'], {
    errorMap: () => ({ message: 'Role must be either \'admin\' or \'normal\'' }),
  }),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await this.authService.register(validatedData);
      res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }

      if (error instanceof Error) {
        if (error.message.includes('already registered')) {
          res.status(409).json({
            status: 'error',
            message: error.message,
          });
          return;
        }
      }

      console.error('Error registering user:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to register user',
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await this.authService.login(validatedData);
      res.json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }

      if (error instanceof Error) {
        if (error.message.includes('Invalid credentials')) {
          res.status(401).json({
            status: 'error',
            message: error.message,
          });
          return;
        }
      }

      console.error('Error logging in:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to login',
      });
    }
  }
} 