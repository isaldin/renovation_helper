import { injectable, inject } from 'tsyringe';
import { ServiceNames, DomainCalculatorMapService, CalculatorResultsService } from '@common';
import { ConfigService } from './config.service.ts';

export interface BotReport {
  fileId: string;
  updatedAt: Date;
}

@injectable()
export class ReportService {
  constructor(
    @inject(ServiceNames.DomainCalculatorMapService)
    private readonly domainCalculatorMapService: DomainCalculatorMapService,
    @inject(ServiceNames.BotConfigService) private readonly configService: ConfigService,
    @inject(ServiceNames.CalculatorResultsService) private readonly calculatorResultsService: CalculatorResultsService
  ) {}

  public async getUserReports(telegramUserId: string): Promise<BotReport[]> {
    try {
      const originUrl = new URL(this.configService.domain);
      const domainCalculatorMap = await this.domainCalculatorMapService.getForDomain(originUrl.hostname);
      if (!domainCalculatorMap) {
        throw new Error('Domain calculator map not found for the current domain');
      }

      const calculatorId = domainCalculatorMap.calculatorId.id;
      if (!calculatorId) {
        throw new Error('Calculator ID not found for the current domain');
      }

      const results = await this.calculatorResultsService.getCalculatorResultsByUserIdAndCalculatorId(
        telegramUserId,
        calculatorId
      );

      return results
        .filter((result) => !!result.reportId)
        .map((result) => ({
          fileId: result.reportId!,
          updatedAt: new Date(result.updatedAt),
        }));
    } catch (error) {
      console.error('Error fetching user reports:', error);
      throw new Error('Failed to fetch user reports');
    }
  }
}
