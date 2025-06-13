import { computed, Ref } from 'vue';
import { SubStep } from '@/common/types';
import { StepWithOptions } from '@app/stores/calculation/types';
import { useCalculationStore } from '@app/stores/calculation';
import { AnswerType } from '@/common/types/calculator';

export const useSubStep = (step: Ref<StepWithOptions | SubStep | null>, answer: Ref<AnswerType | null>) => {
  const store = useCalculationStore();

  const subStep = computed(() => {
    if (!answer.value || !step.value) {
      return null;
    }

    return store.subStepForAnswer(step.value.id, answer.value);
  });

  return {
    subStep,
  };
};
