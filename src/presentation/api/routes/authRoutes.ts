import { Router, Request, Response, NextFunction } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '@/infra/services/AuthService';
import { MongooseUserRepository } from '@/infra/repositories/mongoose/UserRepository';
import { JWTService } from '@/infra/services/JWTService';
import { authMiddleware, adminMiddleware, AuthRequest } from '@/infra/middleware/authMiddleware';

const router = Router();
const userRepository = new MongooseUserRepository();
const jwtService = new JWTService();
const authService = new AuthService(userRepository, jwtService);
const authController = new AuthController(authService);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Create a new user account with name, email, password and role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password (min 6 characters)
 *               role:
 *                 type: string
 *                 enum: [admin, normal]
 *                 description: User's role in the system
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Email already registered
 */

const handleAsync = (fn: (req: Request, res: Response) => Promise<void>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await fn(req, res);
    } catch (error) {
      next(error);
    }
  };
};

router.post('/register', handleAsync(async (req: Request, res: Response) => {
  await authController.register(req, res);
}));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     description: Authenticate user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       200:
 *         description: User successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', handleAsync(async (req: Request, res: Response) => {
  await authController.login(req, res);
}));

// Protected routes
router.use(authMiddleware(authService));

// Admin only routes
router.post('/admin/register', adminMiddleware, handleAsync(async (req: AuthRequest, res: Response) => {
  await authController.register(req, res);
}));

export default router; 