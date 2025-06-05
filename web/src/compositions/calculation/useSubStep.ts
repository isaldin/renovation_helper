import { Ref, ref, watchEffect } from 'vue';
import { SubStep, SubStepBoolean } from '@/common/types';
import { AnswerType, StepWithOptions } from '@app/stores/calculation/types';
import { useCalculationStore } from '@app/stores/calculation';

export const useSubStep = (step: Ref<StepWithOptions | SubStep | null>, answer: Ref<AnswerType | null>) => {
  const store = useCalculationStore();

  const subStep = ref<SubStep | null>(null);
  const embeddedSubStep = ref<SubStep | null>(null);

  watchEffect(() => {
    if (!answer.value || !step.value) {
      subStep.value = null;
      embeddedSubStep.value = null;
      return;
    }

    subStep.value = store.subStepForAnswer(step.value.id, answer.value);

    if (subStep.value?.type === 'boolean' && (subStep.value as SubStepBoolean).embed) {
      embeddedSubStep.value = subStep.value;
      return;
    }

    embeddedSubStep.value = null;
  });

  return {
    embeddedSubStep,
    subStepForAnswer: subStep,
  };
};
