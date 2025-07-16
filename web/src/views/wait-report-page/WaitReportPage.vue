<template>
  <div class="wait-report-page">
    <message-page-layout>
      <template #title> Ожидание отчета </template>
      <template #text> Вы можете закрыть приложение, отчет придет в бот. </template>
    </message-page-layout>
  </div>
</template>

<script setup lang="ts">
import MessagePageLayout from '@app/views/MessagePageLayout.vue';
</script>

<style lang="scss" scoped>
.wait-report-page {
  //
}
</style>
