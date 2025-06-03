<template>
  <div class="rh-collapse-item">
    <slot name="left" />

    <div class="rh-collapse-item__title" :class="{ 'rh-collapse-item__title--expanded': expanded }">
      <template v-if="$slots['default']">
        <div class="rh-collapse-item__content">
          <slot />
        </div>
      </template>

      <slot v-if="hasCollapsableContent" name="right">
        <slot v-if="!expanded" name="expandIcon" :toggle-collapse="toggleCollapse" />
        <slot v-else name="collapseIcon" :toggle-collapse="toggleCollapse" />
      </slot>
    </div>

    <slot v-if="expanded" name="collapsableContent" />
  </div>
  <n-divider />
</template>

<script setup lang="ts">
import { NDivider } from 'naive-ui';
import { useSlots, ref } from 'vue';

const hasCollapsableContent = !!useSlots()['collapsableContent'];

const expanded = ref(false);

const toggleCollapse = () => {
  expanded.value = !expanded.value;
};
</script>

<style lang="scss" scoped>
.rh-collapse-item {
  display: flex;
  flex-direction: column;

  &__title {
    display: flex;

    &--expanded {
      min-height: 48px;
    }
  }

  &__content {
    flex: 1;
  }
}
</style>
