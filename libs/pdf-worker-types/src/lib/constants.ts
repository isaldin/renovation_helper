// Queue Configuration
export const PDF_QUEUE_NAME = 'pdf-generation';

export const DEFAULT_QUEUE_OPTIONS = {
  removeOnComplete: 10,
  removeOnFail: 5,
  attempts: 3,
  backoff: {
    type: 'exponential' as const,
    delay: 2000,
  },
  delay: 0,
  timeout: 120000, // 2 minutes timeout for jobs
};

export const DEFAULT_PDF_OPTIONS = {
  format: 'A4' as const,
  margin: {
    top: '20px',
    right: '20px',
    bottom: '20px',
    left: '20px',
  },
};

// Redis Configuration
export const DEFAULT_REDIS_CONFIG = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
};

// Worker Configuration
export const DEFAULT_WORKER_CONCURRENCY = Number(process.env.WORKER_CONCURRENCY) || 2;

// Timeouts
export const DEFAULT_JOB_TIMEOUT = 120000; // 2 minutes
export const PDF_GENERATION_TIMEOUT = 90000; // 1.5 minutes
export const STALL_INTERVAL = 30000; // 30 seconds - how long a job can run before being considered stalled
export const MAX_STALLED_COUNT = 3; // Maximum number of times a job can be stalled before failing