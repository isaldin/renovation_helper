import { useCalculationStore } from '@app/stores/calculation';
import { computed, Ref, ref, watch } from 'vue';
import { AnswersMap } from '@app/views/calculation/CalculationStepView.types';
import { StepId } from '@/common/types';
import { isSubStepEmbedded } from '@app/stores/calculation/helpers';

// we use composition in two diff places and need to share visibleStepId
const visibleStepId = ref<string | null>(null);

export const useCalculationViewNav = (stepId: Ref<StepId | null>, answersMap: Ref<AnswersMap>) => {
  const calculationStore = useCalculationStore();

  visibleStepId.value = stepId.value;
  const visibleStep = computed(() =>
    visibleStepId.value
      ? calculationStore.steps[visibleStepId.value] ||
        calculationStore.subSteps.find((subStep) => subStep.id === visibleStepId.value) ||
        null
      : null
  );

  watch(stepId, (newValue) => {
    if (newValue !== visibleStepId.value) {
      visibleStepId.value = newValue;
    }
  });

  const currentStep = computed(() => calculationStore.currentStep);

  const subStep = computed(() => {
    if (!currentStep.value) {
      return null;
    }

    const answerForCurrentStep = answersMap.value[currentStep.value!.id];
    if (answerForCurrentStep) {
      return calculationStore.subStepForAnswer(currentStep.value!.id, answerForCurrentStep);
    }

    return null;
  });

  const hasNextStep = computed(() => {
    return subStep.value && visibleStepId.value === currentStep.value?.id && !isSubStepEmbedded(subStep.value);
  });

  const hasPrevStep = computed(() => {
    return subStep.value && visibleStepId.value === subStep.value?.id && !isSubStepEmbedded(subStep.value);
  });

  const submitAvailable = computed(() => {
    if (!Object.values(answersMap.value).every((answer) => answer != null)) {
      return false;
    }

    if (subStep.value && !isSubStepEmbedded(subStep.value)) {
      return subStep.value.id === visibleStepId.value;
    }

    return true;
  });

  const navigateToNextStep = () => {
    if (hasNextStep.value) {
      visibleStepId.value = subStep.value!.id;
    }
  };

  const navigateToPrevStep = () => {
    if (hasPrevStep.value) {
      visibleStepId.value = currentStep.value!.id;
    }
  };

  return {
    hasNextStep,
    hasPrevStep,
    submitAvailable,
    navigateToNextStep,
    navigateToPrevStep,
    visibleStep,
  };
};
