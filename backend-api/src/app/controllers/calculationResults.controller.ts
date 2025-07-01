import { inject, injectable } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';
import { answerSchema, ServiceNames } from '@common';
import { CalculatorResultsService } from '@common/services/calculatorResults/calculatorResults.service';
import { z } from 'zod';

const saveResultsSchema = z.object({
  answers: z.record(answerSchema),
  calculatorId: z.string(),
});

type CalculationResultsRequest = FastifyRequest<{
  Body: z.infer<typeof saveResultsSchema>;
}>;

@injectable()
export class CalculationResultsController {
  constructor(
    @inject(ServiceNames.CalculatorResultsService) private readonly calculatorResultsService: CalculatorResultsService
  ) {}

  public async saveResults(request: CalculationResultsRequest, reply: FastifyReply) {
    const bodyParse = saveResultsSchema.safeParse(request.body);

    if (!bodyParse.success) {
      reply.status(400).send({
        error: 'Invalid request body',
        details: bodyParse.error.errors,
      });
      return;
    }

    const userData = request.user!;

    if (userData.calculatorId !== bodyParse.data.calculatorId) {
      reply.status(400).send({
        error: 'Calculator ID mismatch',
        details: `Received ${bodyParse.data.calculatorId}`,
      });
      return;
    }

    const existedResult = await this.calculatorResultsService.getCalculatorResultsByUserIdAndCalculatorId(
      userData.userId,
      userData.calculatorId
    );

    if (existedResult.length > 0) {
      await this.calculatorResultsService.updateCalculatorResults(existedResult[0].id, {
        results: bodyParse.data.answers,
      });
    } else {
      await this.calculatorResultsService.createCalculatorResults({
        userId: userData.userId,
        calculatorId: userData.calculatorId,
        results: bodyParse.data.answers,
      });
    }

    reply.status(200);
  }

  public get saveResultsSchema() {
    return saveResultsSchema;
  }
}
