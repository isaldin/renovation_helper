import { injectable, inject } from 'tsyringe';
import { ServiceNames } from '../../di';
import { CalculatorSubStepsRepository } from '../../repository/calculator/calculatorSubSteps.repository';
import { SubStep } from '../../types';

@injectable()
export class CalculatorSubStepsService {
  constructor(
    @inject(ServiceNames.CalculatorSubStepsRepository)
    private readonly calculatorSubStepsRepository: CalculatorSubStepsRepository
  ) {}

  public getAll(calculatorId: string): Promise<SubStep[]> {
    return this.calculatorSubStepsRepository.getAllForCalculator(calculatorId);
  }
}
