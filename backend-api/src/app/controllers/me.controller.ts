import { injectable, inject } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ServiceNames } from '@common';
import { CalculatorResultsService } from '@common/services/calculatorResults/calculatorResults.service';

@injectable()
export class MeController {
  constructor(
    @inject(ServiceNames.CalculatorResultsService) private readonly calculatorResultsService: CalculatorResultsService
  ) {}

  public async me(request: FastifyRequest, reply: FastifyReply) {
    const me = request.user;

    const calculatorResults = await this.calculatorResultsService.getCalculatorResultsByUserIdAndCalculatorId(
      me.userId,
      me.calculatorId
    );

    me['reportId'] = calculatorResults[0]?.reportId || undefined;

    return reply.send(me);
  }
}
