import { CalculationStoreState } from '@app/stores/calculation/types';

export const calculationStoreState = (): CalculationStoreState => ({
  status: 'loading',
  calculatorId: null,
  steps: {},
  subSteps: [],
  answers: {},
  currentStepId: null,
});
