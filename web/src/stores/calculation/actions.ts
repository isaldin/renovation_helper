import { AnswerType, CalculationStore, CalculationStoreActions } from '@app/stores/calculation/types';
import { getCalculatorService } from '@app/container';
import { getNextStepId, prepareSteps } from '@app/stores/calculation/helpers';

export const calculationStoreActions: CalculationStoreActions = {
  async fetchCalculator(this: CalculationStore, companyId: string, calculatorId: string) {
    this.status = 'loading';
    this.calculatorId = calculatorId;
    try {
      const calculator = await getCalculatorService().getCalculator(companyId, calculatorId);

      this.steps = prepareSteps(calculator.steps, calculator.optionList);
      this.currentStepId = this.firstStep?.id || null;
      this.status = 'ready';
    } catch (error) {
      console.error('Error fetching calculator:', error);
      this.status = 'error';
      this.error = error as Error;
    }
  },
  goToNextStep(this: CalculationStore) {
    this.currentStepId = getNextStepId(this.currentStep);
  },
  goToPrevStep(this: CalculationStore) {
    if (!this.currentStepId) {
      return;
    }

    const currentStepIdx = this.stepIndexById(this.currentStepId);

    if (currentStepIdx && currentStepIdx > 0) {
      this.currentStepId = this.orderedStepIds[currentStepIdx - 1];
    }
  },
  setAnswer(this: CalculationStore, stepId: string, answer: AnswerType | null) {
    this.answers[stepId] = answer;
  },
};
