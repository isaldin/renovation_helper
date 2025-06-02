import { injectable } from 'tsyringe';

@injectable()
export class TelegramWebAppService {
  public getValue(key: string): string | undefined {
    return {
      calculatorId: 'SxU9GEG9o34PEcoVD0TH',
      companyId: 'c1',
    }[key];
  }
}
