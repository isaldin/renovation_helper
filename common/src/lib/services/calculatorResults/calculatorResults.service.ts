import { inject, injectable } from 'tsyringe';
import { ServiceNames } from '../../di';
import { CalculatorResultsRepository } from '../../repository/calculatorResults/calculatorResults.repository';
import { CalculatorResults } from '../../types/calculatorResults';
import { AnswerType } from '../../types';

@injectable()
export class CalculatorResultsService {
  constructor(
    @inject(ServiceNames.CalculatorResultsRepository)
    private readonly calculatorResultsRepository: CalculatorResultsRepository
  ) {}

  public async createCalculatorResults(input: {
    userId: string;
    calculatorId: string;
    results: Record<string, AnswerType | null>;
  }): Promise<string> {
    const { userId, calculatorId, results } = input;

    const data = {
      userId,
      calculatorId,
      results,
      createdAt: new Date().toISOString(),
    } satisfies Omit<CalculatorResults, 'id'>;

    return this.calculatorResultsRepository.create(data);
  }
}
