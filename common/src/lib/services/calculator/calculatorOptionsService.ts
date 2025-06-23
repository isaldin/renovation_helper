import { inject, injectable } from 'tsyringe';
import { ServiceNames } from '../../di';
import { CalculatorOptionsRepository } from '../../repository/calculator/calculatorOptions.repository';
import { OptionList } from '../../types';

@injectable()
export class CalculatorOptionsService {
  constructor(
    @inject(ServiceNames.CalculatorOptionsRepository)
    protected readonly calculatorOptionsRepository: CalculatorOptionsRepository
  ) {}

  public getAll(calculatorId: string): Promise<OptionList[]> {
    return this.calculatorOptionsRepository.getAll(calculatorId);
  }
}
