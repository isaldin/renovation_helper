import { useCalculationStore } from '@app/stores/calculation';
import { computed, ComputedRef } from 'vue';
import { EntityNotFoundError } from '@/common/errors';
import { StepWithOptions } from '@app/stores/calculation/types';
import { useRouteParams } from '@app/compositions/calculation/useRouteParams';
import { Calculator, Step, StepId, SubStep } from '@/common/types';
import { AnswerType } from '@/common/types/calculator';

export const useCalculation = () => {
  const calculationStore = useCalculationStore();
  const { stepId, subStepId, companyId, calculatorId } = useRouteParams();

  const stepFromRoute: ComputedRef<StepWithOptions | null> = computed(() =>
    stepId.value ? calculationStore.steps[stepId.value as string] : null
  );

  const subStepFromRoute: ComputedRef<SubStep | null> = computed(() => {
    if (!subStepId.value) {
      return null;
    }
    return calculationStore.subSteps.find((subStep) => subStep.id === subStepId.value) || null;
  });

  const currentStep = computed(() => calculationStore.currentStep);
  const currentSubStep = computed(() => calculationStore.currentSubStep);

  const loading = computed(() => calculationStore.loadingStatus === 'loading');
  const notFound = computed(
    () =>
      (calculationStore.loadingStatus === 'error' && calculationStore.error instanceof EntityNotFoundError) ||
      (calculationStore.loadingStatus === 'ready' && Object.values(calculationStore.steps).length === 0)
  );
  const error = computed(() => calculationStore.loadingStatus === 'error');

  const currentStepOrderNumber = computed(() => {
    if (!currentStep.value?.id) {
      return 0;
    }

    const idx = calculationStore.stepIndexById(currentStep.value?.id) ?? -1;
    return idx + 1;
  });

  const currentAnswer = computed(() => {
    if (!currentStep.value) {
      return null;
    }

    if (currentSubStep.value) {
      return calculationStore.answers[currentSubStep.value?.id] ?? null;
    }

    return calculationStore.answers[currentStep.value.id] ?? null;
  });

  const stepsCount = computed(() => calculationStore.stepsCount);

  const loadCalculator = () =>
    calculationStore.fetchCalculator(companyId.value as string, calculatorId.value as string);

  const subStepForCurrentStep = computed(() => {
    if (!currentStep.value || !currentAnswer.value) {
      return null;
    }

    return calculationStore.subStepForAnswer(currentStep.value.id, currentAnswer.value);
  });

  const goToNextStep = () => {
    calculationStore.goToNextStep();
  };

  const goToPrevStep = () => {
    calculationStore.goToPrevStep();
  };

  const setSummaryStep = () => {
    if (summaryStep.value?.id) {
      calculationStore.goToStep(summaryStep.value.id);
    }
  };

  const setAnswerForStep = (stepId: Step['id'] | SubStep['id'], answer: AnswerType | null) => {
    calculationStore.setAnswer(stepId, answer);
  };

  const summaryStep = computed(() => Object.values(calculationStore.steps).find((step) => step.type === 'calc'));

  const getAnswerForStep = (stepId: Step['id'] | SubStep['id']): AnswerType | null => {
    return calculationStore.answers[stepId] ?? null;
  };

  const isStep = (id: StepId): boolean => calculationStore.steps[id] !== undefined;

  const subStepForAnswer = (stepId: Step['id'], answer: AnswerType): SubStep | null =>
    calculationStore.subStepForAnswer(stepId, answer);

  const answerForStepId = (stepId: StepId): AnswerType | null => calculationStore.answers[stepId] ?? null;

  const isEditMode = computed(() => !!calculationStore.editMode);

  const setEditMode = (editMode: boolean) => calculationStore.setEditMode(editMode);

  const setCurrentStep = (stepId: StepId) => (calculationStore.currentStepId = stepId);

  const getCalculatorId = (): Calculator['id'] | null => calculationStore.calculatorId;

  const getAnswers = (): Record<StepId, AnswerType | null> => calculationStore.answers;

  return {
    currentSubStep,
    loading,
    notFound,
    error,
    currentStep,
    currentStepOrderNumber,
    currentAnswer,
    loadCalculator,
    subStepForCurrentStep,
    goToNextStep,
    goToPrevStep,
    setAnswerForStep,
    stepFromRoute,
    subStepFromRoute,
    stepsCount,
    summaryStep,
    setSummaryStep,
    getAnswerForStep,
    isStep,
    subStepForAnswer,
    answerForStepId,
    isEditMode,
    setEditMode,
    setCurrentStep,
    getCalculatorId,
    getAnswers,
  };
};
