import './register-paths';
import 'reflect-metadata';
import { setupContainer } from './container';
import { PdfWorkerService } from './services/pdf-worker.service';
import { GracefulShutdownService } from './services/graceful-shutdown.service';
import { ServiceNames } from '@common';
import { container } from 'tsyringe';

async function startWorker(): Promise<void> {
  setupContainer();

  const workerService = container.resolve<PdfWorkerService>(ServiceNames.PWPdfWorkerService);
  const shutdownService = container.resolve<GracefulShutdownService>(ServiceNames.PWGracefulShutdownService);

  // Register the worker service for graceful shutdown
  shutdownService.register(workerService);

  // Setup signal handlers
  shutdownService.setupSignalHandlers();

  await workerService.init();
}

startWorker().catch((error) => {
  // For startup errors, we still need to use the direct logger since DI container might not be set up
  console.error('Failed to start PDF worker', { error: error.message });
  process.exit(1);
});
