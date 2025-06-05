import { ComputedRef, ref, watchEffect } from 'vue';
import { AnswerType, StepWithOptions } from '@app/stores/calculation/types';
import { useCalculationStore } from '@app/stores/calculation';

export const useStepAnswer = (step: ComputedRef<StepWithOptions | null>) => {
  const calculationStore = useCalculationStore();
  const answer = ref<AnswerType | null>(null);

  watchEffect(() => {
    if (!step.value) {
      answer.value = null;
    } else {
      answer.value = calculationStore.answers[step.value.id] ?? null;
    }
  });

  return answer;
};
