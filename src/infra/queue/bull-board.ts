import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import express from 'express';
import { DailyMedQueueService } from '../services/DailyMedQueueService';
import { AIConsultationQueueService } from '../services/AIConsultationQueueService';
import { QUEUE_NAMES } from '../config/queue';

const app = express();
const serverAdapter = new ExpressAdapter();

// Get queue instances
const dailyMedQueue = new DailyMedQueueService();
const aiConsultationQueue = new AIConsultationQueueService();

// Create Bull Board
createBullBoard({
  queues: [
    new BullMQAdapter(dailyMedQueue.getQueue(QUEUE_NAMES.DAILYMED_CHECK)),
    new BullMQAdapter(aiConsultationQueue.getQueue(QUEUE_NAMES.AI_CONSULTATION))
  ],
  serverAdapter: serverAdapter,
});

serverAdapter.setBasePath('/admin/queues');
app.use('/admin/queues', serverAdapter.getRouter());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.BULL_BOARD_PORT || 3001;

app.listen(port, () => {
  console.log(`Bull Board is running on port ${port}`);
  console.log(`Access the dashboard at http://localhost:${port}/admin/queues`);
}); 