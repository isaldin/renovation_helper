import {
  CalculationStore,
  CalculationStoreGetters,
  CalculationStoreState,
  StepWithOptions,
} from '@app/stores/calculation/types';
import { Step } from '@/common/types';
import { getFirstStep, getNextStepId } from '@app/stores/calculation/helpers';

export const calculationStoreGetters: CalculationStoreGetters = {
  loadingStatus: (state: CalculationStoreState) => state.status,
  currentStep: (state: CalculationStoreState) => {
    if (state.currentStepId) {
      return state.steps[state.currentStepId] || null;
    }
    return null;
  },
  firstStep: (state: CalculationStoreState) => getFirstStep(state.steps),
  stepsCount: (state: CalculationStoreState) => Object.keys(state.steps).length,
  stepIndexById(this: CalculationStore) {
    return (id: string) => {
      return this.orderedStepIds.findIndex((stepId) => stepId === id) ?? null;
    };
  },
  orderedStepIds(this: CalculationStore): Step['id'][] {
    const firstStep = this.firstStep;

    if (!firstStep) {
      return [];
    }

    const orderedSteps: string[] = [];

    let currentStepId: string | null = firstStep.id;
    let iterCount = 0;
    while (currentStepId && iterCount < this.stepsCount) {
      orderedSteps.push(currentStepId);
      const currentStep: StepWithOptions = this.steps[currentStepId];
      if (!currentStep) {
        break;
      }
      currentStepId = getNextStepId(currentStep);
      iterCount++;
    }

    return orderedSteps;
  },
};
