import { useCalculationStore } from '@app/stores/calculation';
import { computed, ComputedRef } from 'vue';
import { EntityNotFoundError } from '@/common/errors';
import { AnswerType, StepWithOptions } from '@app/stores/calculation/types';
import { useRouteParams } from '@app/compositions/calculation/useRouteParams';
import { Step, SubStep } from '@/common/types';

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

  const currentStep: ComputedRef<StepWithOptions | null> = computed(
    () => stepFromRoute.value || calculationStore.currentStep
  );

  const currentSubStep = computed(() => subStepFromRoute.value || calculationStore.currentSubStep);

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
  };
};
