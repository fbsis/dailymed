import 'dotenv/config';
import app from './app';
import { connectDatabase } from '@/infra/config/database';

const PORT = process.env.PORT || 3000;

export async function startServer() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Only start the server if this file is being run directly
if (require.main === module) {
  startServer();
} 