import './register-paths';
import 'reflect-metadata';
import { setupContainer } from './container';
import { container } from 'tsyringe';
import { ServiceNames } from '@common';
import { BotService } from './services/bot.service';

const startBot = async (): Promise<void> => {
  try {
    // Setup dependency injection container
    setupContainer();
    
    // Get bot service from container
    const botService = container.resolve<BotService>(ServiceNames.BotService);
    
    // Start the bot
    await botService.start();
    
    // Handle graceful shutdown
    process.once('SIGINT', async () => {
      console.log('🛑 Received SIGINT, shutting down gracefully...');
      await botService.stop();
      process.exit(0);
    });
    
    process.once('SIGTERM', async () => {
      console.log('🛑 Received SIGTERM, shutting down gracefully...');
      await botService.stop();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
};

startBot();
