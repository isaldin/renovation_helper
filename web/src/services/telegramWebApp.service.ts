import { injectable } from 'tsyringe';
import { TelegramWebAppInitData } from '@app/types';

@injectable()
export class TelegramWebAppService {
  public expandApp() {
    try {
      window.Telegram.WebApp.expand();
    } catch {
      console.log('Telegram.WebApp is not available');
    }
  }

  public getInitData(): TelegramWebAppInitData {
    if (import.meta.env.VITE_TELEGRAM_MODE !== 'true') {
      return '';
    }

    return Telegram.WebApp.initData;
  }
}
