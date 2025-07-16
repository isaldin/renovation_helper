import { Bot, InputFile } from 'grammy';
import { logger } from '../utils/logger';
import { TelegramPdfOptions } from '@renovation-helper/pdf-worker-types';

export class TelegramService {
  private bot: Bot;

  constructor() {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN environment variable is required');
    }
    
    this.bot = new Bot(botToken);
  }

  async init(): Promise<void> {
    try {
      // Test bot token by getting bot info
      const botInfo = await this.bot.api.getMe();

      logger.info('Telegram service initialized', {
        botUsername: botInfo.username,
        botId: botInfo.id,
      });
    } catch (error) {
      logger.error('Failed to initialize Telegram service', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async sendPdf(chatId: string, pdfBuffer: Buffer, options: TelegramPdfOptions): Promise<void> {
    try {
      const inputFile = new InputFile(pdfBuffer, options.filename);
      
      const message = await this.bot.api.sendDocument(chatId, inputFile, {
        caption: options.caption,
      });

      logger.info('PDF sent to Telegram successfully', {
        chatId,
        filename: options.filename,
        messageId: message.message_id,
      });
    } catch (error) {
      logger.error('Failed to send PDF to Telegram', {
        chatId,
        filename: options.filename,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async sendMessage(chatId: string, text: string): Promise<void> {
    try {
      const message = await this.bot.api.sendMessage(chatId, text, {
        parse_mode: 'HTML',
      });

      logger.info('Message sent to Telegram successfully', {
        chatId,
        messageId: message.message_id,
      });
    } catch (error) {
      logger.error('Failed to send message to Telegram', {
        chatId,
        text,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async close(): Promise<void> {
    logger.info('Telegram service closed');
  }
}
