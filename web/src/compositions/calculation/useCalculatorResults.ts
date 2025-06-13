import { getCalculatorResultsService, getTelegramWebAppService } from '@app/container';
import { AnswerType, Calculator, StepId } from '@/common/types';

export const useCalculatorResults = () => {
  const saveCalculatorResults = (calculatorId: Calculator['id'], answers: Record<StepId, AnswerType | null>) => {
    const calculatorResultsService = getCalculatorResultsService();
    const telegramWebAppService = getTelegramWebAppService();

    const userId = telegramWebAppService.getUserId();

    if (!userId) {
      return;
    }

    return calculatorResultsService.createCalculatorResults({
      userId,
      calculatorId,
      results: answers,
    });
  };

  return {
    saveCalculatorResults,
  };
};
