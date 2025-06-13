import { injectable } from 'tsyringe';
import { TelegramWebAppValueKey, telegramWebAppValues } from '@app/services/telegramWebApp.service.const';

@injectable()
export class TelegramWebAppService {
  public getValue(key: TelegramWebAppValueKey): string | undefined {
    return {
      calculatorId: 'MLyNIoycZUT0qre0adhV',
      companyId: 'c1',
      userId: 'u1',
    }[key];
  }

  public getUserId(): string | undefined {
    return this.getValue(telegramWebAppValues.userId);
  }

  public getCalculatorId(): string | undefined {
    return this.getValue(telegramWebAppValues.CalculatorId);
  }
}
