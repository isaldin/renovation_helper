import { BaseAuthController } from './auth.controller.base';
import * as process from 'node:process';

export const getAuthControllerClass = async (): Promise<new (...args: unknown[]) => BaseAuthController> => {
  const isDevMode = process.env.NODE_ENV !== 'production' && process.env.TELEGRAM_MODE !== 'true';

  if (isDevMode) {
    const { DevAuthController } = await import('./auth.controller.dev.js');
    return DevAuthController as new (...args: unknown[]) => BaseAuthController;
  }

  const { AuthController } = await import('./auth.controller.js');
  return AuthController as new (...args: unknown[]) => BaseAuthController;
};
