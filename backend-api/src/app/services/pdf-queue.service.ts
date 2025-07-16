import { injectable } from 'tsyringe';
import Bull, { Queue, Job } from 'bull';
import { logger } from '../utils/logger';
import {
  PdfJobData,
  PdfJobResult,
  JobStatusResponse,
  PDF_QUEUE_NAME,
  DEFAULT_QUEUE_OPTIONS,
  DEFAULT_REDIS_CONFIG,
  DEFAULT_JOB_TIMEOUT,
} from '@renovation-helper/pdf-worker-types';

@injectable()
export class PdfQueueService {
  private queue: Queue<PdfJobData>;

  constructor() {
    this.queue = new Bull(PDF_QUEUE_NAME, {
      redis: DEFAULT_REDIS_CONFIG,
      defaultJobOptions: DEFAULT_QUEUE_OPTIONS,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.queue.on('completed', (job: Job<PdfJobData>) => {
      logger.info('PDF generation job completed', { jobId: job.id });
    });

    this.queue.on('failed', (job: Job<PdfJobData>, err: Error) => {
      logger.error('PDF generation job failed', {
        jobId: job.id,
        error: err.message,
        attempts: job.attemptsMade,
      });
    });

    this.queue.on('stalled', (job: Job<PdfJobData>) => {
      logger.warn('PDF generation job stalled', { jobId: job.id });
    });
  }

  async addPdfJob(data: PdfJobData, priority = 0): Promise<Job<PdfJobData>> {
    const job = await this.queue.add(data, {
      priority,
      delay: 0,
    });

    logger.info('PDF generation job added to queue', {
      jobId: job.id,
      priority,
    });

    return job;
  }

  private async waitForJob(jobId: string, _timeout = DEFAULT_JOB_TIMEOUT): Promise<PdfJobResult> {
    const job = await this.queue.getJob(jobId);

    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    try {
      const result = await job.finished();
      return result as PdfJobResult;
    } catch (error) {
      logger.error('Job failed while waiting', {
        jobId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async getJobStatus(jobId: string): Promise<JobStatusResponse> {
    const job = await this.queue.getJob(jobId);

    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    const state = await job.getState();

    return {
      status: state,
      progress: job.progress(),
      result: job.returnvalue,
      error: job.failedReason,
    };
  }

  async generatePdfSync(data: PdfJobData, timeout = DEFAULT_JOB_TIMEOUT): Promise<Buffer> {
    const job = await this.addPdfJob(data, 10); // High priority for sync requests

    try {
      const result = await this.waitForJob(job.id.toString(), timeout);

      if (!result.success || !result.pdfBuffer) {
        throw new Error(result.error || 'PDF generation failed');
      }

      return result.pdfBuffer;
    } catch (error) {
      logger.error('Sync PDF generation failed', {
        jobId: job.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.queue.close();
    logger.info('PDF Queue service closed');
  }
}
