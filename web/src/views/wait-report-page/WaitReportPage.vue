<template>
  <div class="wait-report-page">
    <message-page-layout>
      <template #title> Ожидание отчета </template>
      <template #text> Вы можете закрыть приложение, отчет придет в бот. </template>

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
.wait-report-page {
  //
}
</style>
