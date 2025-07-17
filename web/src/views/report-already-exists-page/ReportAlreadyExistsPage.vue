<template>
  <div class="report-already-exists-page">
    <message-page-layout>
      <template #title> Ваш отчет готов! </template>
      <template #text>
        <div class="text-center">
          Ваш отчет уже был успешно сгенерирован ранее. Для удобства вы можете найти и открыть его в интерфейсе бота.
        </div>
      </template>

      <div class="mt-4">
        <n-button type="primary" size="large" @click="handleCloseApp"> К боту </n-button>
      </div>
    </message-page-layout>
  </div>
</template>

<script setup lang="ts">
import MessagePageLayout from '@app/views/MessagePageLayout.vue';
import { NButton } from 'naive-ui';
import { getTelegramWebAppService } from '@app/container';

const handleCloseApp = () => {
  getTelegramWebAppService().closeApp();
};
</script>

<style lang="scss" scoped>
.report-already-exists-page {
  //
}
</style>
