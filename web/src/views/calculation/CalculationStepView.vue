<template>
  <component
    :is="getComponentForStep(step)"
    v-if="getComponentForStep(step)"
    :key="step.id"
    class="flex-1"
    :title="step.title"
    :options="getOptionItems(step)"
    :value="valueForStep"
    :embedded-sub-step="embeddedSubStep"
    @answer="handleAnswer"
    @embedded-substep:answer="handleEmbeddedSubStepAnswer($event)"
  />
</template>

<script setup lang="ts">
import CalculationStepAreaView from '@app/views/calculation/CalculationStepAreaView.vue';
import { computed, toRefs } from 'vue';
import CalculationStepSelectView from '@app/views/calculation/CalculationStepSelectView.vue';
import CalculationStepMultipleSelectView from '@app/views/calculation/CalculationStepMultipleSelectView.vue';
import { OptionItem, SubStep } from '@/common/types';
import CalculationStepBooleanView from '@app/views/calculation/CalculationStepBooleanView.vue';
import { AnswerType, StepWithOptions } from '@app/stores/calculation/types';
import { isStepWithOptions, isStepWithOptionsFrom, isSubStepWithOptionItems } from '@app/stores/calculation/helpers';
import CalculationStepSummaryView from '@app/views/calculation/CalculationStepSummaryView.vue';

const props = defineProps<{
  step: StepWithOptions | SubStep;
  answer: AnswerType | null;
  embeddedSubStep: SubStep | null;
  subStepAnswer?: AnswerType | null;
}>();

const emit = defineEmits<{
  (e: 'update:answer', answer: AnswerType | null): void;
  (e: 'update:sub-step-answer', answer: AnswerType | null): void;
  (e: 'update:embedded-substep-answer', answer: AnswerType | null): void;
}>();

const getComponentForStep = (step: StepWithOptions | SubStep) => {
  if (step.type === 'number') {
    return CalculationStepAreaView;
  } else if (step.type === 'select' && !isMultipleSelect(step)) {
    return CalculationStepSelectView;
  } else if (step.type === 'checkbox' && isMultipleSelect(step)) {
    return CalculationStepMultipleSelectView;
  } else if (step.type === 'boolean') {
    return CalculationStepBooleanView;
  } else if (step.type === 'calc') {
    return CalculationStepSummaryView;
  }

  return null;
};

const { step } = toRefs(props);

const valueForStep = computed(
  () => (isSubStep(step.value) ? props.subStepAnswer : props.answer) ?? getDefaultValue(step.value)
);

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

const handleAnswer = (answer: AnswerType | null) => {
  if (isSubStep(step.value)) {
    emit('update:sub-step-answer', answer);
    return;
  }

  emit('update:answer', answer);
};

const handleEmbeddedSubStepAnswer = (answer: AnswerType | null) => {
  emit('update:embedded-substep-answer', answer);
};

const isSubStep = (input: StepWithOptions | SubStep): input is SubStep => {
  return Object.hasOwn(input, 'choiceFromSource');
};
</script>
