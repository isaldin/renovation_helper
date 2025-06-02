<template>
  <div class="rh-collapse-item">
    <slot name="left" />

    <template v-if="$slots['default']">
      <div class="rh-collapse-item__content">
        <slot />
      </div>
    </template>

    <slot v-if="hasCollapsableContent" name="right">
      <div>icon</div>
    </slot>

    <slot name="collapsableContent" />
  </div>
  <n-divider />
</template>

<script setup lang="ts">
import { NDivider } from 'naive-ui';
import { useSlots } from 'vue';

const hasCollapsableContent = !!useSlots()['collapsableContent'];
</script>

<style lang="scss" scoped>
.rh-collapse-item {
  display: flex;

  &__content {
    flex: 1;
  }
}
</style>
