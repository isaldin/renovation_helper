import { inject, injectable } from 'tsyringe';
import { ServiceNames } from '../../di';
import { CalculatorResultsRepository } from '../../repository/calculatorResults/calculatorResults.repository';
import { CalculatorResults } from '../../types/calculatorResults';
import { AnswerType } from '../../types';

type CalculatorResultsInput = {
  userId: string;
  calculatorId: string;
  results: Record<string, AnswerType | null>;
};

@injectable()
export class CalculatorResultsService {
  constructor(
    @inject(ServiceNames.CalculatorResultsRepository)
    private readonly calculatorResultsRepository: CalculatorResultsRepository
  ) {}

  public async createCalculatorResults(input: CalculatorResultsInput): Promise<string> {
    const { userId, calculatorId, results } = input;

    const data = {
      userId,
      calculatorId,
      results,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } satisfies Omit<CalculatorResults, 'id'>;

    return this.calculatorResultsRepository.create(data);
  }

  public async getCalculatorResultsByUserIdAndCalculatorId(
    userId: string,
    calculatorId: string
  ): Promise<CalculatorResults[]> {
    return this.calculatorResultsRepository.getWhere({ userId, calculatorId });
  }

  public async updateCalculatorResults(id: string, data: Partial<CalculatorResultsInput>): Promise<void> {
    return await this.calculatorResultsRepository.update(id, { ...data, updatedAt: new Date().toISOString() });
  }
}
