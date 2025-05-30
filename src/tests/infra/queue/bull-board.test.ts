import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { DailyMedQueueService } from '@/infra/services/DailyMedQueueService';
import { AIConsultationQueueService } from '@/infra/services/AIConsultationQueueService';
import { QUEUE_NAMES } from '@/infra/config/queue';
import { Queue } from 'bullmq';

// Mock dependencies
jest.mock('@bull-board/api', () => ({
  createBullBoard: jest.fn()
}));

jest.mock('@bull-board/api/bullMQAdapter', () => ({
  BullMQAdapter: jest.fn()
}));

jest.mock('@bull-board/express', () => ({
  ExpressAdapter: jest.fn().mockImplementation(() => ({
    setBasePath: jest.fn(),
    getRouter: jest.fn().mockReturnValue({
      use: jest.fn()
    })
  }))
}));

jest.mock('express', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    use: jest.fn(),
    get: jest.fn(),
    listen: jest.fn().mockImplementation((_port: number, callback: () => void) => {
      callback();
      return {
        close: jest.fn()
      };
    })
  }))
}));

jest.mock('@/infra/services/DailyMedQueueService');
jest.mock('@/infra/services/AIConsultationQueueService');

describe('Bull Board Setup', () => {
  let mockDailyMedQueue: jest.Mocked<DailyMedQueueService>;
  let mockAIConsultationQueue: jest.Mocked<AIConsultationQueueService>;
  let mockQueue: jest.Mocked<Queue>;

  beforeEach(() => {
    // Mock console.log to prevent logs during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});

    // Setup mock queue
    mockQueue = {
      name: 'test-queue',
      add: jest.fn(),
      getJob: jest.fn(),
      getJobs: jest.fn(),
      getJobCounts: jest.fn(),
      removeAllJobs: jest.fn(),
      close: jest.fn()
    } as any;

    // Setup mock services
    mockDailyMedQueue = {
      getQueue: jest.fn().mockReturnValue(mockQueue)
    } as any;

    mockAIConsultationQueue = {
      getQueue: jest.fn().mockReturnValue(mockQueue)
    } as any;

    (DailyMedQueueService as jest.MockedClass<typeof DailyMedQueueService>).mockImplementation(() => mockDailyMedQueue);
    (AIConsultationQueueService as jest.MockedClass<typeof AIConsultationQueueService>).mockImplementation(() => mockAIConsultationQueue);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should create Bull Board with correct queues', async () => {
    // Import the module to trigger the setup
    await import('@/infra/queue/bull-board');

 
    // Verify queue adapters were created with correct queues
    expect(BullMQAdapter).toHaveBeenCalledWith(mockQueue);
    expect(BullMQAdapter).toHaveBeenCalledTimes(2);

    // Verify services were instantiated
    expect(DailyMedQueueService).toHaveBeenCalled();
    expect(AIConsultationQueueService).toHaveBeenCalled();

    // Verify queue retrieval
    expect(mockDailyMedQueue.getQueue).toHaveBeenCalledWith(QUEUE_NAMES.DAILYMED_CHECK);
    expect(mockAIConsultationQueue.getQueue).toHaveBeenCalledWith(QUEUE_NAMES.AI_CONSULTATION);
  });

}); 