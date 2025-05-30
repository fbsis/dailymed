import request from 'supertest';
import express, { Router, RequestHandler, Response } from 'express';
import app from '../app';

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key';

// Mock the drug routes
jest.mock('../routes/drugRoutes', () => {
  const router: Router = express.Router();
  const getHandler: RequestHandler = (_req, res: Response) => {
    res.status(200).json({ message: 'Drugs route working' });
    return;
  };
  const postHandler: RequestHandler = (_req, res: Response) => {
    res.status(201).json({ message: 'Drug created' });
    return;
  };
  
  router.get('/', getHandler);
  router.post('/', postHandler);
  return router;
});

// Mock auth routes
jest.mock('../routes/authRoutes', () => {
  const router: Router = express.Router();
  router.post('/register', (_req, res: Response) => {
    res.status(201).json({ message: 'User registered' });
    return;
  });
  router.post('/login', (_req, res: Response) => {
    res.status(200).json({ message: 'User logged in' });
    return;
  });
  return router;
});

// Mock swagger
jest.mock('swagger-ui-express', () => ({
  serve: (_req: any, _res: any, next: any) => next(),
  setup: () => (_req: any, res: any) => {
    res.send('swagger-ui');
    return;
  }
}));

// Mock error handlers
jest.mock('../middleware/errorHandler', () => ({
  errorHandler: (err: any, _req: any, res: any, _next: any) => {
    res.status(500).json({ error: err.message });
    return;
  },
  notFoundHandler: (_req: any, res: any) => {
    res.status(404).json({ error: 'Not found' });
    return;
  }
}));

// Restore environment variables after tests
afterAll(() => {
  delete process.env.JWT_SECRET;
});

describe('Express App', () => {
  describe('Middleware', () => {
    it('should parse JSON requests', async () => {
      const response = await request(app)
        .post('/api/drugs')
        .send({ name: 'Test Drug' })
        .set('Content-Type', 'application/json');

      expect(response.status).not.toBe(415); // Not Unsupported Media Type
    });
  });

  describe('Routes', () => {
    it('should serve Swagger documentation', async () => {
      const response = await request(app).get('/api-docs');
      expect(response.status).toBe(200);
      expect(response.text).toContain('swagger-ui');
    });

    it('should handle drugs routes', async () => {
      const response = await request(app).get('/api/drugs');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Drugs route working' });
    });

    it('should handle POST to drugs route', async () => {
      const response = await request(app)
        .post('/api/drugs')
        .send({ name: 'Test Drug' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: 'Drug created' });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Not found' });
    });

  });
}); 