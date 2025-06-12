<template>
  <component
    :is="getComponentForStep(step)"
    v-if="getComponentForStep(step)"
    :key="step.id"
    :step-id="step.id"
    :title="step.title"
    :answers-map="answersMap"
    class="flex-1"
    @update:answers-map="handleUpdateAnswersMap"
  />
</template>

<script setup lang="ts">
import CalculationStepAreaView from '@app/views/calculation/CalculationStepAreaView.vue';
import { toRefs } from 'vue';
import CalculationStepSelectView from '@app/views/calculation/CalculationStepSelectView.vue';
import CalculationStepMultipleSelectView from '@app/views/calculation/CalculationStepMultipleSelectView.vue';
import { SubStep } from '@/common/types';
import CalculationStepBooleanView from '@app/views/calculation/CalculationStepBooleanView.vue';
import { StepWithOptions } from '@app/stores/calculation/types';
import { isStepWithOptionsFrom, isSubStepWithOptionItems } from '@app/stores/calculation/helpers';
import CalculationStepSummaryView from '@app/views/calculation/CalculationStepSummaryView.vue';
import { AnswersMap } from '@app/views/calculation/CalculationStepView.types';

const props = defineProps<{
  step: StepWithOptions | SubStep;
  answersMap: AnswersMap;
}>();

const emit = defineEmits<{
  (e: 'update:answersMap', answersMap: AnswersMap): void;
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

const isMultipleSelect = (step: StepWithOptions | SubStep): boolean => {
  return (isStepWithOptionsFrom(step) || isSubStepWithOptionItems(step)) && !!step.multiple;
};

const handleUpdateAnswersMap = (answersMap: AnswersMap) => {
  emit('update:answersMap', answersMap);
};
</script>
