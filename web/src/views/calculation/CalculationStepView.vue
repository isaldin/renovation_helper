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
    :options="step.options"
    :value="valueForStep as unknown as OptionItem['id'] || null"
    @answer="handleAnswer"
  />

  <calculation-step-multiple-select-view
    v-else-if="step.type === 'checkbox' && isMultipleSelect(step)"
    :key="step.id"
    class="flex-1"
    :title="step.title"
    :options="step.options"
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
import { computed } from 'vue';
import CalculationStepSelectView from '@app/views/calculation/CalculationStepSelectView.vue';
import CalculationStepMultipleSelectView from '@app/views/calculation/CalculationStepMultipleSelectView.vue';
import { OptionItem } from '@/common/types';
import CalculationStepBooleanView from '@app/views/calculation/CalculationStepBooleanView.vue';
import { AnswerType, StepWithOptions } from '@app/stores/calculation/types';
import { isStepWithOptionsFrom } from '@app/stores/calculation/helpers';

const calculationStore = useCalculationStore();

const { step } = defineProps<{
  step: StepWithOptions;
}>();

const valueForStep = computed(() => calculationStore.answers[step.id]);

const handleAnswer = (answer: AnswerType | null) => {
  console.log('Answer:', step.id, answer);
  calculationStore.setAnswer(step.id, answer);
};

const isMultipleSelect = (step: StepWithOptions) => {
  return isStepWithOptionsFrom(step) && step.multiple;
};
</script>
