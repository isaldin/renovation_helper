import { inject, injectable } from 'tsyringe';
import { ServiceNames } from '../../di';
import { Calculator } from '../../types';
import { CalculatorRepository } from '../../repository/calculator/calculator.repository';
import { CalculatorSettingsService } from './calculatorSettings.service';
import { CalculatorNotFoundError, CalculatorSettingsNotFoundError } from '../../errors';
import { CalculatorStepsService } from './calculatorSteps.service';
import { CalculatorOptionsService } from './calculatorOptionsService';
import { CalculatorSubStepsService } from './calculatorSubSteps.service';

@injectable()
export class CalculatorService {
  constructor(
    @inject(ServiceNames.CalculatorRepository) private readonly calculatorRepository: CalculatorRepository,
    @inject(ServiceNames.CalculatorSettingsService) private readonly settingsService: CalculatorSettingsService,
    @inject(ServiceNames.CalculatorStepsService) private readonly stepsService: CalculatorStepsService,
    @inject(ServiceNames.CalculatorOptionsService) private readonly optionsService: CalculatorOptionsService,
    @inject(ServiceNames.CalculatorSubStepsService) private readonly subStepsService: CalculatorSubStepsService
  ) {}

  public async getCalculator(companyId: string, calculatorId: string): Promise<Calculator> {
    const calculator = await this.calculatorRepository.getByCompanyAndId(companyId, calculatorId);

    if (!calculator) {
      throw new CalculatorNotFoundError();
    }

    const settings = await this.settingsService.get(companyId, calculator.id);
    if (!settings) {
      throw new CalculatorSettingsNotFoundError();
    }

    const steps = await this.stepsService.getAll(companyId, calculatorId);
    const subSteps = await this.subStepsService.getAll(companyId, calculatorId);
    const optionList = await this.optionsService.getAll(companyId, calculatorId);

    return {
      ...calculator,
      settings,
      steps,
      optionList,
      subSteps,
    } satisfies Calculator;
  }
}
