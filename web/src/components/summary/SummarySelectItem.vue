<template>
  <summary-item-layout :embedded="embedded">
    <template #title>
      {{ step.title }}
    </template>

    <template #answer>
      {{ answerText }}
    </template>

    <template #sub-step>
      <slot name="sub-step" />
    </template>
  </summary-item-layout>
</template>

<script setup lang="ts">
import SummaryItemLayout from '@app/components/summary/SummaryItemLayout.vue';
import { SummaryItemProps } from '@app/components/summary/summary.types';
import { isStepWithOptions, isSubStepWithOptionItems } from '@app/stores/calculation/helpers';

const { step, answer } = defineProps<SummaryItemProps>();

const answerText = (() => {
  if (typeof answer !== 'string') {
    return null;
  }

  if (isStepWithOptions(step)) {
    return step.options.find((option) => option.id === answer)?.title || null;
  } else if (isSubStepWithOptionItems(step)) {
    return step.optionItems.find((option) => option.id === answer)?.title || null;
  }

  return null;
})();
</script>
