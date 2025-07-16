<template>
  <div class="rh-modal">
    <n-modal :show="showModal">
      <slot />
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { NModal } from 'naive-ui';

defineProps<{
  showModal: boolean;
}>();
</script>

<style lang="scss" scoped>
.rh-modal {
  //
}
</style>
