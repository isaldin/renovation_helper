<template>
  <calculation-step-area-view
    v-if="step.type === 'number'"
    :key="step.id"
    class="flex-1"
    :title="step.title"
    :value="valueForStep as number || 0"
    @answer="handleAnswer"
  />

  <calculation-step-select-view
    v-else-if="step.type === 'select' && !isMultipleSelect(step)"
    :key="step.id"
    class="flex-1"
    :title="step.title"
    :options="getOptionItems(step)"
    :value="valueForStep as unknown as OptionItem['id'] || null"
    :embedded-sub-step="embeddedSubStep"
    @answer="handleAnswer"
    @substep:answer="handleSubStepAnswer"
  />

  <calculation-step-multiple-select-view
    v-else-if="step.type === 'checkbox' && isMultipleSelect(step)"
    :key="step.id"
    class="flex-1"
    :title="step.title"
    :options="getOptionItems(step)"
    :value="valueForStep as unknown as OptionItem['id'][] || null"
    @answer="handleAnswer"
  />

  <calculation-step-boolean-view
    v-else-if="step.type === 'boolean'"
    :key="step.id"
    class="flex-1"
    :title="step.title"
    :value="valueForStep as unknown as boolean"
    @answer="handleAnswer"
  />
</template>

<script setup lang="ts">
import CalculationStepAreaView from '@app/views/calculation/CalculationStepAreaView.vue';
import { useCalculationStore } from '@app/stores/calculation';
import { computed, toRefs } from 'vue';
import CalculationStepSelectView from '@app/views/calculation/CalculationStepSelectView.vue';
import CalculationStepMultipleSelectView from '@app/views/calculation/CalculationStepMultipleSelectView.vue';
import { OptionItem, SubStep, SubStepBoolean } from '@/common/types';
import CalculationStepBooleanView from '@app/views/calculation/CalculationStepBooleanView.vue';
import { AnswerType, StepWithOptions } from '@app/stores/calculation/types';
import { isStepWithOptions, isStepWithOptionsFrom, isSubStepWithOptionItems } from '@app/stores/calculation/helpers';

const calculationStore = useCalculationStore();

const props = defineProps<{
  step: StepWithOptions | SubStep;
}>();

const { step } = toRefs(props);

const valueForStep = computed(() => calculationStore.answers[step.value.id] ?? getDefaultValue(step.value));

const handleAnswer = (answer: AnswerType | null) => {
  calculationStore.setAnswer(step.value.id, answer);
};

const handleSubStepAnswer = (subStepId: SubStep['id'], answer: AnswerType | null) => {
  calculationStore.setAnswer(subStepId, answer);
};

const isMultipleSelect = (step: StepWithOptions | SubStep): boolean => {
  return (isStepWithOptionsFrom(step) || isSubStepWithOptionItems(step)) && !!step.multiple;
};

const getDefaultValue = (step: StepWithOptions | SubStep): AnswerType | null => {
  if (isSubStepWithOptionItems(step)) {
    return step.defaultValue ?? null;
  } else if (isStepWithOptionsFrom(step)) {
    return step.defaultValue ?? null;
  }
  return null;
};

const getOptionItems = (step: StepWithOptions | SubStep): OptionItem[] => {
  if (isSubStepWithOptionItems(step)) {
    return step.optionItems;
  } else if (isStepWithOptions(step)) {
    return step.options;
  }
  return [];
};

const embeddedSubStep = computed(() => {
  const answer = calculationStore.answers[step.value.id];

  if (!answer) {
    return null;
  }

  const subStep = calculationStore.subStepForAnswer(step.value.id, answer);

  if (subStep?.type === 'boolean' && (subStep as SubStepBoolean).embed) {
    const subStepAnswer = calculationStore.answers[subStep.id];

    return {
      object: subStep,
      forOptionId: answer as string,
      value: subStepAnswer,
    } satisfies { object: SubStep; forOptionId: OptionItem['id']; value: AnswerType | null };
  }

  return null;
});
</script>
