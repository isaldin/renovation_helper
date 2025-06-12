import { ComputedRef, ref, watch, computed } from 'vue';
import { StepWithOptions } from '@app/stores/calculation/types';
import { useCalculationStore } from '@app/stores/calculation';
import { AnswersMap } from '@app/views/calculation/CalculationStepView.types';
import { StepId } from '@/common/types';
import { getDefaultOptionId } from '@app/stores/calculation/helpers';

export const useStepAnswersMap = (step: ComputedRef<StepWithOptions | null>) => {
  const calculationStore = useCalculationStore();
  const answersMap = ref<AnswersMap>({});

  const answer = computed(() => (step.value?.id ? calculationStore.answers[step.value.id] : null));

  const answersMapForStep = (stepId: StepId): AnswersMap => {
    const subStep = answer.value ? calculationStore.subStepForAnswer(stepId, answer.value) : null;

    const result: AnswersMap = {
      [stepId]: answer.value ?? null,
    };

    if (subStep) {
      result[subStep.id] = calculationStore.answers[subStep.id] ?? getDefaultOptionId(subStep) ?? null;
    }

    return result;
  };

  watch(step, (value) => {
    if (!value) {
      answersMap.value = {};
    } else {
      answersMap.value = answersMapForStep(value.id);
    }
  });

  const initialAnswersMap = (stepId: StepId): AnswersMap => answersMapForStep(stepId);

  return {
    answersMap,
    initialAnswersMap,
  };
};
