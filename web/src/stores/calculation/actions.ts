import { AnswerType, CalculationStore, CalculationStoreActions } from '@app/stores/calculation/types';
import { getCalculatorService } from '@app/container';
import { getNextStepId, isSubStepEmbedded, prepareSteps } from '@app/stores/calculation/helpers';

export const calculationStoreActions: CalculationStoreActions = {
  async fetchCalculator(this: CalculationStore, companyId: string, calculatorId: string) {
    this.status = 'loading';
    this.calculatorId = calculatorId;
    try {
      const calculator = await getCalculatorService().getCalculator(companyId, calculatorId);

      this.steps = prepareSteps(calculator.steps, calculator.optionList);
      this.subSteps = calculator.subSteps;
      this.currentStepId = this.firstStep?.id || null;
      this.status = 'ready';
    } catch (error) {
      console.error('Error fetching calculator:', error);
      this.status = 'error';
      this.error = error as Error;
    }
  },
  goToNextStep(this: CalculationStore) {
    const currentAnswer = this.answers[this.currentStepId!];
    if (currentAnswer == null) {
      return;
    }

    const subStep = this.subStepForAnswer(this.currentStepId!, currentAnswer);
    if (!this.currentSubStep && subStep && !isSubStepEmbedded(subStep)) {
      this.currentSubStepId = subStep.id;
      return;
    }

    this.currentSubStepId = null;
    this.currentStepId = getNextStepId(this.currentStep);
  },
  goToPrevStep(this: CalculationStore) {
    if (!this.currentStepId) {
      return;
    }

    if (this.currentSubStepId) {
      this.setAnswer(this.currentSubStepId, null);
      this.currentSubStepId = null;
      return;
    }

    const currentStepIdx = this.stepIndexById(this.currentStepId);

    if (currentStepIdx && currentStepIdx > 0) {
      this.currentStepId = this.orderedStepIds[currentStepIdx - 1];
    }
  },
  setAnswer(this: CalculationStore, stepId: string, answer: AnswerType | null) {
    // check if before was set subStep answer for this step and delete
    // covers case when user select embed substep and then select another answer without substep,
    // in this case subStep answer for prev answer leaves in store
    const currentAnswer = this.answers[this.currentStepId!];
    const currentSubStepForAnswer = currentAnswer && this.subStepForAnswer(this.currentStepId!, currentAnswer);
    if (currentSubStepForAnswer) {
      this.answers[currentSubStepForAnswer.id] = null;
    }

    this.answers[stepId] = answer;
  },
};
