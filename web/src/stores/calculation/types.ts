import { OptionItem, OptionList, Step, SubStep } from '@/common/types';
import { Store } from 'pinia';
import { AnswerType } from '@/common/types/calculator';

export const CALCULATION_STORE_NAME = 'calculation';

type CalculatorStoreLoadingStatus = 'loading' | 'ready' | 'error';

export type StepWithOptions = Omit<Step, 'optionsFrom'> & {
  options: OptionList['options'];
  defaultValue?: OptionItem['id'];
  subSteps: SubStep[];
};

export type CalculationStoreState = {
  status: CalculatorStoreLoadingStatus;
  error?: Error;
  calculatorId: string | null;
  steps: Record<Step['id'], StepWithOptions>;
  subSteps: SubStep[];
  answers: Record<Step['id'], AnswerType | null>;
  currentStepId: Step['id'] | null;
  currentSubStepId?: SubStep['id'] | null;
  editMode?: boolean;
};

export type CalculationStoreActions = {
  fetchCalculator: (calculatorId: string) => Promise<void>;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  goToStep(stepId: Step['id']): void;
  setAnswer: (stepId: string, answer: AnswerType | null) => void;
  setEditMode: (editMode: boolean) => void;
};

export type CalculationStoreGetters = {
  loadingStatus(state: CalculationStoreState): CalculatorStoreLoadingStatus;
  currentStep(state: CalculationStoreState): StepWithOptions | null;
  currentSubStep(state: CalculationStoreState): SubStep | null;
  firstStep(state: CalculationStoreState): StepWithOptions | null;
  stepsCount(state: CalculationStoreState): number;
  stepIndexById(state: CalculationStoreState): (id: string) => number | null;
  orderedStepIds(state: CalculationStoreState): Array<Step['id']>;
  subStepForAnswer(state: CalculationStoreState): (stepId: string, answer: AnswerType) => SubStep | null;
};

export type CalculationStore = Store<
  typeof CALCULATION_STORE_NAME,
  CalculationStoreState,
  CalculationStoreGetters,
  CalculationStoreActions
>;
