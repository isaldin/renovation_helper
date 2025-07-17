import { inject, injectable } from 'tsyringe';
import Bull from 'bull';
import { PdfService } from './pdf.service';
import { TelegramService } from './telegram.service';
import { LoggerService } from './logger.service';
import { Shutdownable } from './graceful-shutdown.types';
import {
  PdfJobData,
  PdfJobResult,
  PdfJob,
  PDF_QUEUE_NAME,
  DEFAULT_REDIS_CONFIG,
  DEFAULT_WORKER_CONCURRENCY,
  DEFAULT_QUEUE_OPTIONS,
  STALL_INTERVAL,
  MAX_STALLED_COUNT,
} from '../types/worker.types';
import { ServiceNames } from '@common';
import { CalculatorResultsService } from '@common';

@injectable()
export class PdfWorkerService implements Shutdownable {
  private queue: Bull.Queue<PdfJobData> | null = null;

  constructor(
    @inject(ServiceNames.PWPdfService) private readonly pdfService: PdfService,
    @inject(ServiceNames.PWTelegramService) private readonly telegramService: TelegramService,
    @inject(ServiceNames.CalculatorResultsService) private readonly calculatorResultsService: CalculatorResultsService,
    @inject(ServiceNames.PWLoggerService) private readonly logger: LoggerService
  ) {}

  async init(): Promise<void> {
    await this.pdfService.init();
    await this.telegramService.init();

    this.queue = new Bull<PdfJobData>(PDF_QUEUE_NAME, {
      redis: DEFAULT_REDIS_CONFIG,
      settings: {
        stalledInterval: STALL_INTERVAL,
        maxStalledCount: MAX_STALLED_COUNT,
      },
      defaultJobOptions: {
        ...DEFAULT_QUEUE_OPTIONS,
        removeOnComplete: 10,
        removeOnFail: 5,
      },
    });

    this.setupJobProcessor();
    this.setupEventHandlers();

    // Clean up any stalled jobs on startup
    await this.cleanupStalledJobs();

    this.logger.info('PDF Worker started', {
      queue: PDF_QUEUE_NAME,
      concurrency: DEFAULT_WORKER_CONCURRENCY,
      stallInterval: STALL_INTERVAL,
      maxStalledCount: MAX_STALLED_COUNT,
    });
  }

  private setupJobProcessor(): void {
    if (!this.queue) {
      throw new Error('Queue not initialized');
    }

    this.queue.process(DEFAULT_WORKER_CONCURRENCY, async (job: PdfJob): Promise<PdfJobResult> => {
      return this.processJob(job);
    });
  }

  private async processJob(job: PdfJob): Promise<PdfJobResult> {
    this.logger.info('Processing PDF generation job', { jobId: job.id });

    try {
      const { reportData, options, telegramUserId, calculatorId } = job.data;

      // Update job progress to prevent stalling
      await job.progress(10);

      const pdfBuffer = await this.pdfService.generatePdf(reportData, options || {});

      // Update progress after PDF generation
      await job.progress(60);

      const reportFileId = await this.telegramService.sendPdf(telegramUserId, Buffer.from(pdfBuffer), {
        filename: `renovation-report-${calculatorId}.pdf`,
        caption: '🏠 Ваш отчет по расчету ремонта готов!',
      });

      // Update progress after Telegram send
      await job.progress(80);

      this.logger.info('PDF generation job result', { reportId: reportFileId });
      await this.calculatorResultsService.updateCalculatorResults(job.data.calculatorResultsId, {
        reportId: reportFileId,
      });

      // Update progress to 100% when job is complete
      await job.progress(100);

      this.logger.info('PDF generated and sent to Telegram', {
        jobId: job.id,
        telegramUserId,
        calculatorId,
      });

      return { success: true, sent: true };
    } catch (error) {
      this.logger.error('Failed to generate PDF or send to Telegram', {
        jobId: job.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      this.logger.error(error);
      throw error;
    }
  }

  private async cleanupStalledJobs(): Promise<void> {
    if (!this.queue) {
      return;
    }

    try {
      const stalledJobs = await this.queue.getJobs(['stalled' as Bull.JobStatus], 0, -1);

      if (stalledJobs.length > 0) {
        this.logger.info(`Found ${stalledJobs.length} stalled jobs, cleaning up...`);

        for (const job of stalledJobs) {
          try {
            await job.moveToFailed(new Error('Job was stalled on worker startup'), true);
            this.logger.info('Moved stalled job to failed', { jobId: job.id });
          } catch (error) {
            this.logger.error('Failed to move stalled job to failed', {
              jobId: job.id,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      }
    } catch (error) {
      this.logger.error('Failed to cleanup stalled jobs', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private setupEventHandlers(): void {
    if (!this.queue) {
      throw new Error('Queue not initialized');
    }

    this.queue.on('completed', (job: PdfJob, result: PdfJobResult) => {
      this.logger.info('Job completed', { jobId: job.id, result });
    });

    this.queue.on('failed', (job: PdfJob | undefined, err: Error) => {
      this.logger.error('Job failed', { jobId: job?.id, error: err.message });
    });

    this.queue.on('stalled', (job: PdfJob) => {
      this.logger.warn('Job stalled', {
        jobId: job.id,
        attemptsMade: job.attemptsMade,
        maxAttempts: job.opts.attempts,
        data: job.data,
      });
    });

    this.queue.on('error', (err: Error) => {
      this.logger.error('Worker error', { error: err.message });
    });

    this.queue.on('waiting', (jobId: string) => {
      this.logger.debug('Job waiting', { jobId });
    });

    this.queue.on('active', (job: PdfJob) => {
      this.logger.info('Job started', { jobId: job.id });
    });

    this.queue.on('progress', (job: PdfJob, progress: number) => {
      this.logger.debug('Job progress', { jobId: job.id, progress });
    });
  }

  async close(): Promise<void> {
    if (this.queue) {
      await this.queue.close();
    }
    await this.pdfService.close();
    await this.telegramService.close();
    this.logger.info('PDF Worker closed');
  }
}
