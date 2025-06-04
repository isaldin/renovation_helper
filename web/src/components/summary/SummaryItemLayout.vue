<template>
  <div class="summary-item-layout" :class="{ 'summary-item-layout--embedded': embedded }">
    <div class="summary-item-layout__title">
      <slot name="title" />
    </div>
    <div class="summary-item-layout__answer">
      <slot name="answer" />
    </div>
    <div v-if="!embedded && hasSubStepSlot" class="summary-item-layout__sub-step">
      <slot name="sub-step" />
    </div>
  </div>

  <n-divider v-if="!embedded" />
</template>

<script setup lang="ts">
import { NDivider } from 'naive-ui';
import { useSlots } from 'vue';

defineProps<{
  embedded?: boolean;
}>();

const slots = useSlots();

const hasSubStepSlot = !!slots['sub-step'];
</script>

<style lang="scss" scoped>
.summary-item-layout {
  &--embedded {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  &--embedded > &__title {
    font-size: 14px;
    line-height: 14px;
  }

  &--embedded > &__answer {
    display: flex;
    margin-top: 0;
    font-size: 16px;
    line-height: 16px;
  }

  &__title {
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
  }

  &__answer {
    font-size: 18px;
    line-height: 24px;
    font-weight: 300;
    margin-top: 16px;
  }

  &__sub-step {
    margin-top: 16px;
  }
}
</style>
