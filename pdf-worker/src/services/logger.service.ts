import { injectable } from 'tsyringe';
import pino from 'pino';

@injectable()
export class LoggerService {
  private logger: pino.Logger;

  constructor() {
    this.logger = pino({
      name: 'pdf-worker',
      level: process.env.LOG_LEVEL || 'info',
      ...(process.env.NODE_ENV === 'development' && {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
      }),
    });
  }

  info(message: string, data?: any): void {
    this.logger.info(data, message);
  }

  error(message: string, data?: any): void;
  error(error: Error | unknown): void;
  error(messageOrError: string | Error | unknown, data?: any): void {
    if (typeof messageOrError === 'string') {
      this.logger.error(data, messageOrError);
    } else {
      this.logger.error(messageOrError);
    }
  }

  warn(message: string, data?: any): void {
    this.logger.warn(data, message);
  }

  debug(message: string, data?: any): void {
    this.logger.debug(data, message);
  }
}