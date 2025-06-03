import { injectable } from 'tsyringe';

@injectable()
export class TelegramWebAppService {
  public getValue(key: string): string | undefined {
    return {
      calculatorId: 'MLyNIoycZUT0qre0adhV',
      companyId: 'c1',
    }[key];
  }
}
