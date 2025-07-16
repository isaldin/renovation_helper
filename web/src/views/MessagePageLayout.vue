<template>
  <div class="message-page-layout">
    <n-h2>
      <slot name="title" />
    </n-h2>

    <div class="message-page-layout__text">
      <slot name="text" />
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { NH2 } from 'naive-ui';
</script>

<style lang="scss" scoped>
.message-page-layout {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  height: 100vh;
  height: 100dvh;
}
</style>
