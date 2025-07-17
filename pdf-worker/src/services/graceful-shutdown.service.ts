import { inject, injectable } from 'tsyringe';
import { LoggerService } from './logger.service';
import { Shutdownable } from './graceful-shutdown.types';
import { ServiceNames } from '@common';

@injectable()
export class GracefulShutdownService {
  private resources: Shutdownable[] = [];
  private isShuttingDown = false;

  constructor(
    @inject(ServiceNames.PWLoggerService) private readonly logger: LoggerService
  ) {}

  register(resource: Shutdownable): void {
    this.resources.push(resource);
  }

  async shutdown(signal: string): Promise<void> {
    if (this.isShuttingDown) {
      this.logger.warn('Shutdown already in progress, ignoring signal', { signal });
      return;
    }

    this.isShuttingDown = true;
    this.logger.info(`Received ${signal}, shutting down gracefully...`);

    try {
      // Close all registered resources in reverse order
      const closePromises = this.resources.reverse().map(async (resource) => {
        try {
          await resource.close();
        } catch (error) {
          this.logger.error('Error closing resource during shutdown', {
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      });

      await Promise.all(closePromises);
      
      this.logger.info('Graceful shutdown completed successfully');
      process.exit(0);
    } catch (error) {
      this.logger.error('Error during graceful shutdown', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      process.exit(1);
    }
  }

  setupSignalHandlers(): void {
    process.on('SIGINT', () => this.shutdown('SIGINT'));
    process.on('SIGTERM', () => this.shutdown('SIGTERM'));
  }
}