import { inject, injectable } from 'tsyringe';
import { ServiceNames } from '../../di';
import { CalculatorStepsRepository } from '../../repository/calculator/calculatorSteps.repository';
import { Step } from '../../types';

@injectable()
export class CalculatorStepsService {
  constructor(
    @inject(ServiceNames.CalculatorStepsRepository)
    protected readonly calculatorStepsRepository: CalculatorStepsRepository
  ) {}

  public getAll(companyId: string, calculatorId: string): Promise<Step[]> {
    return this.calculatorStepsRepository.getAllForCompanyAndCalculator(companyId, calculatorId);
  }
}
