<template>
  <summary-item-layout>
    <template #title>
      {{ step.title }}
    </template>
    <template #answer>
      <div class="summary-number-item__answer">
        {{ `${answer}${step.id === 'area' ? ' м²' : ''}` }}
      </div>
    </template>
  </summary-item-layout>
</template>

<script setup lang="ts">
import SummaryItemLayout from '@app/components/summary/SummaryItemLayout.vue';
import { SummaryItemProps } from '@app/components/summary/summary.types';

defineProps<SummaryItemProps>();
</script>

<style lang="scss" scoped>
.summary-number-item {
  &__answer {
    font-size: 24px;
    line-height: 32px;
  }
}
</style>
