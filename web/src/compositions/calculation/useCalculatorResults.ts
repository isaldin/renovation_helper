import { getHttpCalculationResultsService, getMeService } from '@app/container';
import { AnswerType, Calculator, StepId } from '@/common/types';

export const useCalculatorResults = () => {
  const saveCalculatorResults = (calculatorId: Calculator['id'], answers: Record<StepId, AnswerType | null>) => {
    const calculatorResultsService = getHttpCalculationResultsService();

    const userId = getMeService().getMe()!.userId;

    if (!userId) {
      return;
    }

    return calculatorResultsService.saveCalculationResults(calculatorId, answers);
  };

  return {
    saveCalculatorResults,
  };
};
