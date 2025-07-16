<template>
  <div class="error-page">
    <message-page-layout>
      <template #title> Произошла ошибка </template>
      <template #text> Пожалуйста, попробуйте перезапустить калькулятор </template>

      <div class="pt-8">
        <n-button size="large" type="primary" @click="handleGoToIndexPage"> На главную </n-button>
      </div>
    </message-page-layout>
  </div>
</template>

<script setup lang="ts">
import MessagePageLayout from '@app/views/MessagePageLayout.vue';
import { NButton } from 'naive-ui';

const handleGoToIndexPage = () => {
  window.location.href = '/';
};
</script>

<style lang="scss" scoped>
.error-page {
  //
}
</style>
