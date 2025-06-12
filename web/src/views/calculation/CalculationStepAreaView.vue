<template>
  <rh-area-input v-model:value="value" :title="title" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import RhAreaInput from '@app/components/RhAreaInput.vue';
import { CalculationStepViewEmits, CalculationStepViewProps } from '@app/views/calculation/CalculationStepView.types';

const { stepId, answersMap } = defineProps<CalculationStepViewProps>();

const emits = defineEmits<CalculationStepViewEmits>();

const value = computed({
  get: () => {
    return (answersMap[stepId] as number) || null;
  },
  set: (newValue: number | null) => {
    const updatedAnswersMap = { [stepId]: newValue };
    emits('update:answers-map', updatedAnswersMap);
  },
});
</script>
