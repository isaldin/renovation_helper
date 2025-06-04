<template>
  <div class="calculation-step-summary-view">
    <template v-for="stepId in orderedSteps" :key="stepId">
      <summary-item-view :step="steps[stepId]" :answer="answers[stepId] ?? null" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useCalculationStore } from '@app/stores/calculation';
import SummaryItemView from '@app/components/summary/SummaryItemView.vue';

const store = useCalculationStore();
const orderedSteps = store.orderedStepIds;
const answers = store.answers;
const steps = store.steps;
</script>

<style lang="scss" scoped>
.calculation-step-summary-view {
  width: 100%;
}
</style>
