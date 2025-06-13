import { CalculationStore, CalculationStoreActions } from '@app/stores/calculation/types';
import { getCalculatorService } from '@app/container';
import { getNextStepId, prepareSteps } from '@app/stores/calculation/helpers';
import { Step } from '@/common/types';
import { AnswerType } from '@/common/types/calculator';

export const calculationStoreActions: CalculationStoreActions = {
  async fetchCalculator(this: CalculationStore, companyId: string, calculatorId: string) {
    this.status = 'loading';
    this.calculatorId = calculatorId;
    try {
      const calculator = await getCalculatorService().getCalculator(companyId, calculatorId);

      this.steps = prepareSteps(calculator.steps, calculator.optionList);
      this.subSteps = calculator.subSteps;
      this.currentStepId = this.currentStepId || this.firstStep?.id || null;
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
  goToStep(this: CalculationStore, stepId: Step['id']) {
    if (this.currentStepId === stepId) {
      return;
    }

    this.currentStepId = stepId;
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
  setEditMode(this: CalculationStore, editMode: boolean) {
    this.editMode = editMode;
  },
};
