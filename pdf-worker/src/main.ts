import 'reflect-metadata';
import Bull from 'bull';
import { PdfService } from './services/pdf.service';
import { TelegramService } from './services/telegram.service';
import { logger } from './utils/logger';
import {
  PdfJobData,
  PdfJobResult,
  PdfJob,
  PDF_QUEUE_NAME,
  DEFAULT_REDIS_CONFIG,
  DEFAULT_WORKER_CONCURRENCY,
} from './types/worker.types';

async function startWorker() {
  const pdfService = new PdfService();
  const telegramService = new TelegramService();

  await pdfService.init();
  await telegramService.init();

  const queue = new Bull<PdfJobData>(PDF_QUEUE_NAME, {
    redis: DEFAULT_REDIS_CONFIG,
  });

  queue.process(DEFAULT_WORKER_CONCURRENCY, async (job: PdfJob): Promise<PdfJobResult> => {
    logger.info('Processing PDF generation job', { jobId: job.id });

    try {
      const { reportData, options, telegramUserId, calculatorId } = job.data;

      // Generate PDF
      const pdfBuffer = await pdfService.generatePdf(reportData, options || {});

      // Send PDF to Telegram
      await telegramService.sendPdf(telegramUserId, Buffer.from(pdfBuffer), {
        filename: `renovation-report-${calculatorId}.pdf`,
        caption: '🏠 Ваш отчет по расчету ремонта готов!',
      });

      logger.info('PDF generated and sent to Telegram', {
        jobId: job.id,
        telegramUserId,
        calculatorId,
      });

      return { success: true, sent: true };
    } catch (error) {
      logger.error('Failed to generate PDF or send to Telegram', {
        jobId: job.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      logger.error(error);
      throw error;
    }
  });

  queue.on('completed', (job: PdfJob, result: PdfJobResult) => {
    logger.info('Job completed', { jobId: job.id, result });
  });

  queue.on('failed', (job: PdfJob | undefined, err: Error) => {
    logger.error('Job failed', { jobId: job?.id, error: err.message });
  });

  queue.on('error', (err: Error) => {
    logger.error('Worker error', { error: err.message });
  });

  logger.info('PDF Worker started', {
    queue: PDF_QUEUE_NAME,
    concurrency: DEFAULT_WORKER_CONCURRENCY,
  });

  const gracefulShutdown = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down PDF worker...`);
    try {
      await queue.close();
      await pdfService.close();
      await telegramService.close();
      logger.info('PDF worker shut down gracefully');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      process.exit(1);
    }
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}

startWorker().catch((error) => {
  logger.error('Failed to start PDF worker', { error: error.message });
  process.exit(1);
});
