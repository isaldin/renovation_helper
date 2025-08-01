import { injectable, inject } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ServiceNames } from '@common';
import { CalculatorService } from '@common/services/calculator/calculator.service';
import { CalculatorResultsService } from '@common/services/calculatorResults/calculatorResults.service';
import { CompanyService } from '@common/services';
import { CalculatorNotFoundError } from '@common/errors';
import {
  Calculator,
  Company,
  CalculatorResults,
  AnswerType,
  SubStep,
  isSubStepWithOptionItems,
  isStepWithOptionsFrom,
} from '@common/types';
import { PdfQueueService } from '../../services/pdf-queue.service';
import { logger } from '../../utils/logger';
import { metrics, timed } from '../../utils/metrics';
import { errorTracker, trackErrors } from '../../utils/errorTracking';
import { OptionItem, StepWithOptionsFrom, Step } from '@common/types';
import { getOrderedSteps } from './getOrderedSteps';

interface ReportData {
  companyInfo: {
    name: string;
    phone: string;
    email: string;
  };
  reportInfo: {
    date: string;
    projectId: string;
  };
  options: Array<{
    question: string;
    answer: string;
    subStep: {
      question: string;
      answer: string;
    } | null;
  }>;
  totalPrice: string;
  currency: string;
}

@injectable()
export class ReportController {
  constructor(
    @inject(ServiceNames.CalculatorService) private readonly calculatorService: CalculatorService,
    @inject(ServiceNames.CalculatorResultsService) private readonly calculatorResultsService: CalculatorResultsService,
    @inject(ServiceNames.CompanyService) private readonly companyService: CompanyService,
    @inject(ServiceNames.BAPdfQueueService) private readonly pdfQueueService: PdfQueueService
  ) {}

  @timed('report_generation', { operation: 'getReport' })
  @trackErrors('getReport', 'report-controller', 'high')
  public async getReport(request: FastifyRequest, reply: FastifyReply) {
    const { calculatorId, userId } = request.user;

    // Set operation context for all subsequent logs
    logger.setContext({
      operation: 'getReport',
      component: 'report-controller',
      calculatorId,
      requestedUserId: userId,
    });

    logger.info('Report generation started', {
      calculatorId,
      userId,
    });

    try {
      // Validate calculator exists
      const calculatorTimer = metrics.timer('db_calculator_fetch');
      const calculator = await this.calculatorService.getCalculator(calculatorId);
      calculatorTimer.end();

      if (!calculator) {
        errorTracker.trackBusinessError('getReport', `Calculator not found: ${calculatorId}`, {
          additional: { calculatorId },
        });
        throw new CalculatorNotFoundError(calculatorId);
      }

      logger.debug('Calculator found', {
        calculatorId: calculator.id,
      });

      // Fetch calculation results
      const resultsTimer = metrics.timer('db_results_fetch');
      const results = await this.calculatorResultsService.getCalculatorResultsByUserIdAndCalculatorId(
        userId,
        calculatorId
      );
      resultsTimer.end();

      if (!results || results.length === 0) {
        logger.warn('No calculation results found', {
          calculatorId,
          userId,
        });
        return reply.status(404).send({
          error: 'No calculation results found for this user and calculator',
        });
      }

      logger.debug('Calculation results found', {
        resultsCount: results.length,
        latestResult: results[0]?.createdAt,
      });

      // Fetch company information
      const companyTimer = metrics.timer('db_company_fetch');
      const company = await this.companyService.getCompany(calculator.companyId);
      companyTimer.end();

      if (!company) {
        errorTracker.trackBusinessError('getReport', `Company not found: ${calculator.companyId}`, {
          additional: {
            companyId: calculator.companyId,
          },
        });
        throw new Error(`Company not found for calculator ${calculatorId}`);
      }

      logger.debug('Company information loaded', {
        companyName: company.name,
        companyId: company.id,
      });

      // Generate report data and queue PDF job
      const reportData = this.buildReportData(calculator, results[0], company);

      const queueTimer = metrics.timer('pdf_queue_add');
      const jobId = await this.pdfQueueService.addPdfJob({
        reportData,
        userId,
        calculatorId,
        telegramUserId: request.user?.userId || userId,
        calculatorResultsId: results[0].id,
      });
      queueTimer.end();

      logger.audit('PDF generation queued', {
        jobId,
        calculatorId,
        userId,
        companyId: company.id,
      });

      // Record successful operation metrics
      metrics.increment('report_requests_total', 1, {
        status: 'success',
        calculatorId: calculator.id,
      });

      logger.info('Report generation completed successfully', {
        jobId,
        duration:
          Date.now() -
          ((request as FastifyRequest & { logContext?: { startTime: number } }).logContext?.startTime || Date.now()),
      });

      return reply.status(200).send({
        message: 'PDF report generation started',
        jobId,
        estimatedTime: '30-60 seconds',
      });
    } catch (error) {
      // Error is already tracked by @trackErrors decorator
      logger.error('Report generation failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        calculatorId,
        userId,
      });

      metrics.increment('report_requests_total', 1, {
        status: 'error',
        errorType: error instanceof Error ? error.name : 'UnknownError',
      });

      // Return appropriate error response
      if (error instanceof CalculatorNotFoundError) {
        return reply.status(404).send({ error: (error as CalculatorNotFoundError).message });
      }

      return reply.status(500).send({
        error: 'Internal server error during report generation',
      });
    }
  }

  private buildReportData(calculator: Calculator, results: CalculatorResults, company: Company): ReportData {
    const timer = metrics.timer('report_data_build');

    try {
      // Transform calculator steps&substeps and results into options
      const options =
        getOrderedSteps(calculator.steps).map((step) => {
          const answer = results.results[step.id];
          const options = ['select', 'checkbox'].includes(step.type)
            ? calculator.optionList.find((list) => list.id === (step as StepWithOptionsFrom).optionsFrom)?.options || []
            : [];

          const subStep: SubStep | null = ((_step: Step, _answer: AnswerType | null) => {
            return (
              calculator.subSteps.find((subStep) => {
                if (subStep.sourceStepId !== _step.id) {
                  return false;
                }

                if (subStep.choiceFromSource instanceof Array) {
                  return subStep.choiceFromSource.includes(_answer as string);
                }

                return subStep.choiceFromSource === _answer;
              }) || null
            );
          })(step, answer);

          const subStepOptions = subStep
            ? {
                question: subStep.title || 'No sub-question',
                answer: this.formatAnswer(
                  subStep.type,
                  results.results[subStep.id],
                  isSubStepWithOptionItems(subStep) ? subStep.optionItems : []
                ),
              }
            : null;

          return {
            question: step.title || 'No question',
            answer: this.formatAnswer(step.type, answer, options),
            subStep: subStepOptions,
          };
        }) || [];

      const totalPrice = this.calculateTotalPrice(calculator, results.results);

      const reportData: ReportData = {
        companyInfo: {
          name: company.name,
          phone: company.phone || '',
          email: company.email || '',
        },
        reportInfo: {
          date: new Date().toLocaleDateString('ru-RU'),
          projectId: results.id,
        },
        options,
        totalPrice: totalPrice.toLocaleString('ru-RU'),
        currency: 'тг',
      };

      timer.end();

      logger.debug('Report data built successfully', {
        optionsCount: reportData.options.length,
        totalPrice: reportData.totalPrice,
      });

      return reportData;
    } catch (error) {
      timer.end();
      errorTracker.track(
        error as Error,
        {
          operation: 'buildReportData',
          component: 'report-controller',
        },
        'medium'
      );
      throw error;
    }
  }

  private formatAnswer(stepType: Step['type'], answer: AnswerType | null, options: OptionItem[]): string {
    if (answer === null || answer === undefined) {
      return 'Не выбрано';
    }

    if (stepType === 'boolean') {
      return answer ? 'Да' : 'Нет';
    }

    if (stepType === 'number') {
      return answer.toString();
    }

    if (stepType === 'select') {
      return options.find((opt) => opt.id === answer)?.title || (answer as string);
    }

    if (stepType === 'checkbox') {
      return (answer as string[])
        .map((item) => {
          if (typeof item === 'string') {
            return options.find((opt) => opt.id === item)?.title || item;
          }
          return item;
        })
        .join(', ');
    }

    return String(answer);
  }

  private calculateTotalPrice(calculator: Calculator, results: Record<string, AnswerType | null>): number {
    let totalPrice = 0;

    // Get area from results (assuming there's an 'area' step)
    const area = Number(results['area']) || 0;

    // Calculate pricing from main steps
    for (const step of calculator.steps) {
      const answer = results[step.id];
      if (answer === null || answer === undefined) continue;

      // Handle boolean steps
      if (step.type === 'boolean' && answer === true) {
        totalPrice += step.price || 0;
        totalPrice += (step.pricePerM2 || 0) * area;
      }

      // Handle select/checkbox steps
      if (isStepWithOptionsFrom(step)) {
        const selectedIds = Array.isArray(answer) ? answer : [answer];

        for (const selectedId of selectedIds) {
          const options = calculator.optionList.find((list) => list.id === step.optionsFrom)?.options || [];
          const selectedOption = options.find((item) => item.id === selectedId);
          if (selectedOption) {
            totalPrice += selectedOption.price || 0;
            totalPrice += (selectedOption.pricePerM2 || 0) * area;
          }
        }
      }

      // Handle number steps with pricing
      if (step.type === 'number' && typeof answer === 'number') {
        totalPrice += (step.price || 0) * answer;
        totalPrice += (step.pricePerM2 || 0) * area;
      }
    }

    // Calculate pricing from substeps
    for (const subStep of calculator.subSteps) {
      const parentAnswer = results[subStep.sourceStepId];
      if (parentAnswer === null || parentAnswer === undefined) continue;

      // Check if this substep should be activated
      const shouldActivate = Array.isArray(subStep.choiceFromSource)
        ? subStep.choiceFromSource.includes(parentAnswer as string)
        : subStep.choiceFromSource === parentAnswer;

      if (!shouldActivate) continue;

      // Get substep answer
      const subStepAnswer = results[subStep.id];
      if (subStepAnswer === null || subStepAnswer === undefined) continue;

      // Handle boolean substeps
      if (subStep.type === 'boolean' && subStepAnswer === true) {
        totalPrice += subStep.price || 0;
        totalPrice += (subStep.pricePerM2 || 0) * area;
      }

      // Handle select/checkbox substeps
      if (subStep.type === 'select' || subStep.type === 'checkbox') {
        const selectedIds = Array.isArray(subStepAnswer) ? subStepAnswer : [subStepAnswer];

        for (const selectedId of selectedIds) {
          const selectedOption = subStep.optionItems.find((item) => item.id === selectedId);
          if (selectedOption) {
            totalPrice += selectedOption.price || 0;
            totalPrice += (selectedOption.pricePerM2 || 0) * area;
          }
        }
      }
    }

    return Math.round(totalPrice);
  }
}
