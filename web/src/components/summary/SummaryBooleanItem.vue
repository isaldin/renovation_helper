<template>
  <summary-item-layout :embedded="embedded">
    <template #title>
      {{ step.title }}
    </template>

    <template #answer>
      <n-icon class="summary-boolean-item__answer" :size="embedded ? 16 : 32" :color="!answer ? '#C70039' : '#28A745'">
        <remove-circle-outline v-if="!answer" />
        <add-circle-outline v-else />
      </n-icon>
    </template>
  </summary-item-layout>
</template>

<script setup lang="ts">
import { RemoveCircleOutline, AddCircleOutline } from '@vicons/ionicons5';
import { NIcon } from 'naive-ui';
import SummaryItemLayout from '@app/components/summary/SummaryItemLayout.vue';
import { SummaryItemProps } from '@app/components/summary/summary.types';

defineProps<SummaryItemProps>();
</script>

<style lang="scss" scoped>
.summary-boolean-item {
  &__answer {
    height: 16px;
  }
}
</style>
