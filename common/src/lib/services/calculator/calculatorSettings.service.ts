import { inject, injectable } from 'tsyringe';
import { ServiceNames } from '../../di';
import { CalculatorSettingsRepository } from '../../repository/calculator/calculatorSettings.repository';
import { CalculatorSettings } from '../../types';

@injectable()
export class CalculatorSettingsService {
  constructor(
    @inject(ServiceNames.CalculatorSettingsRepository)
    private readonly settingsRepository: CalculatorSettingsRepository
  ) {}

  public async get(companyId: string, calculatorId: string): Promise<CalculatorSettings | null> {
    return this.settingsRepository.get(companyId, calculatorId);
  }
}
