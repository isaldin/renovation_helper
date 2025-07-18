import { Bot, InlineKeyboard, Keyboard } from 'grammy';
import { inject, injectable } from 'tsyringe';
import { ServiceNames } from '@common';
import { ReportService, BotReport } from './report.service';
import { t } from '../translations';
import { BotContext, BotCallbackContext } from '../types/bot.types';
import { ConfigService } from './config.service.ts';

@injectable()
export class BotService {
  private bot: Bot<BotContext>;

  constructor(
    @inject(ServiceNames.BotReportService) private readonly reportService: ReportService,
    @inject(ServiceNames.BotConfigService) private readonly configService: ConfigService
  ) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN environment variable is required');
    }

    this.bot = new Bot<BotContext>(botToken);
    this.setupHandlers();
  }

  private setupHandlers = (): void => {
    // Handle /start command
    this.bot.command('start', async (ctx) => {
      const userId = ctx.from?.id?.toString();
      if (!userId) {
        await ctx.reply(t('errors.userNotIdentified'));
        return;
      }

      await this.handleStartCommand(ctx, userId);
    });

    // Handle callback queries for buttons (for report selection only)
    this.bot.on('callback_query:data', async (ctx) => {
      const data = ctx.callbackQuery.data;
      const userId = ctx.from?.id?.toString();

      if (!userId) {
        await ctx.answerCallbackQuery(t('errors.userNotIdentified'));
        return;
      }

      await this.handleCallback(ctx, data, userId);
    });

    // Handle text messages (general keyboard buttons)
    this.bot.on('message:text', async (ctx) => {
      const userId = ctx.from?.id?.toString();
      if (!userId) {
        await ctx.reply(t('errors.userNotIdentified'));
        return;
      }

      await this.handleTextMessage(ctx, ctx.message.text, userId);
    });
  };

  private handleStartCommand = async (ctx: BotContext, userId: string): Promise<void> => {
    try {
      // Get user's reports
      const reports = await this.reportService.getUserReports(userId);

      if (reports.length === 0) {
        // No reports - show Start calc button
        await this.showStartCalcButton(ctx, userId);
      } else {
        // Has reports - show list reports button
        await this.showReportsMenu(ctx, userId, reports);
      }
    } catch (error) {
      console.error('Error handling start command:', error);
      await ctx.reply(t('errors.generalError'));
    }
  };

  private showStartCalcButton = async (ctx: BotContext, _userId: string): Promise<void> => {
    try {
      const keyboard = new Keyboard()
        .text(t('buttons.startCalculator'))
        .resized();

      await ctx.reply(t('welcome.noReports'), { reply_markup: keyboard });
    } catch (error) {
      console.error('Error starting calculator:', error);
      await ctx.reply(t('errors.calculatorError'));
    }
  };

  private showReportsMenu = async (ctx: BotContext, _userId: string, reports: BotReport[]): Promise<void> => {
    try {
      const keyboard = new Keyboard()
        .text(t('buttons.viewReports', { count: reports.length }))
        .row()
        .text(t('buttons.startNewCalculator'))
        .resized();

      await ctx.reply(t('welcome.withReports', { count: reports.length }), { reply_markup: keyboard });
    } catch (error) {
      console.error('Error showing reports menu:', error);
      await ctx.reply(t('errors.showReportsMenuError'));
    }
  };

  private handleCallback = async (ctx: BotCallbackContext, data: string, userId: string): Promise<void> => {
    await ctx.answerCallbackQuery();

    if (data === 'list_reports') {
      await this.handleListReports(ctx, userId);
    } else if (data === 'back_to_main') {
      await this.handleStartCommand(ctx, userId);
    } else if (data.startsWith('report_')) {
      const reportIndex = parseInt(data.replace('report_', ''), 10);
      await this.handleSendReport(ctx, userId, reportIndex);
    } else {
      await ctx.reply(t('errors.unknownAction'));
    }
  };

  private handleListReports = async (ctx: BotContext, userId: string): Promise<void> => {
    try {
      const reports = await this.reportService.getUserReports(userId);

      if (reports.length === 0) {
        await ctx.reply(t('reports.noReports'));
        return;
      }

      const message = t('reports.listTitle', { count: reports.length });

      const keyboard = new InlineKeyboard();

      // Add button for each report
      reports.forEach((report, index) => {
        const reportDate = new Date(report.updatedAt).toLocaleDateString('ru-RU');
        const buttonText = `📄 ${index + 1}. ${reportDate}`;
        keyboard.text(buttonText, `report_${index}`);
        if (index < reports.length - 1) {
          keyboard.row(); // New row for each button
        }
      });

      // Create general keyboard for navigation
      const generalKeyboard = new Keyboard()
        .text(t('buttons.back'))
        .text(t('buttons.startNewCalculator'))
        .resized();

      await ctx.reply(message, { reply_markup: keyboard });
      await ctx.reply(t('buttons.navigationHelp'), { reply_markup: generalKeyboard });
    } catch (error) {
      console.error('Error listing reports:', error);
      await ctx.reply(t('errors.fetchReportsError'));
    }
  };

  private handleTextMessage = async (ctx: BotContext, text: string, userId: string): Promise<void> => {
    try {
      if (text === t('buttons.startCalculator') || text === t('buttons.startNewCalculator')) {
        // Open web app
        const webAppUrl = this.configService.domain;
        if (webAppUrl) {
          const keyboard = new InlineKeyboard().webApp(t('buttons.openCalculator'), webAppUrl);
          await ctx.reply(t('buttons.calculatorOpening'), { reply_markup: keyboard });
        } else {
          await ctx.reply(t('errors.calculatorUnavailable'));
        }
      } else if (text.includes(t('buttons.viewReports').split('(')[0].trim())) {
        // View reports button (contains partial match)
        await this.handleListReports(ctx, userId);
      } else if (text === t('buttons.back')) {
        // Back button
        await this.handleStartCommand(ctx, userId);
      } else {
        // Unknown command
        await ctx.reply(t('errors.unknownCommand'));
      }
    } catch (error) {
      console.error('Error handling text message:', error);
      await ctx.reply(t('errors.generalError'));
    }
  };

  private handleSendReport = async (ctx: BotContext, userId: string, reportIndex: number): Promise<void> => {
    try {
      // Get user reports to find the specific report
      const reports = await this.reportService.getUserReports(userId);

      if (reportIndex < 0 || reportIndex >= reports.length) {
        await ctx.reply(t('errors.reportNotFound'));
        return;
      }

      const report = reports[reportIndex];

      // Send the report file using the Telegram file ID
      await ctx.replyWithDocument(report.fileId, {
        caption: t('reports.sendingReport'),
      });
    } catch (error) {
      console.error('Error sending report:', error);
      await ctx.reply(t('errors.sendReportError'));
    }
  };

  public async start(): Promise<void> {
    console.log('🤖 Starting Telegram bot...');
    await this.bot.start();
    console.log('✅ Bot started successfully');
  }

  public async stop(): Promise<void> {
    console.log('🛑 Stopping Telegram bot...');
    await this.bot.stop();
    console.log('✅ Bot stopped successfully');
  }
}
