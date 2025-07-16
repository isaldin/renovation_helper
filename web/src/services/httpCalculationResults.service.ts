import { inject, injectable } from 'tsyringe';
import { AnswerType, StepId } from '@/common/types';
import { ServiceNames } from '@/common';
import { HttpService } from '@app/services/http.service';

@injectable()
export class HttpCalculationResultsService {
  constructor(@inject(ServiceNames.WAHttpService) private readonly httpService: HttpService) {}

  public saveCalculationResults(calculatorId: string, answers: Record<StepId, AnswerType | null>): Promise<void> {
    return this.httpService.post('/calculation-results', { calculatorId, answers });
  }
}
