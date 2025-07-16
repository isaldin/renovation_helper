<template>
  <div class="unauthorized-page">
    <message-page-layout>
      <template #title> У вас нет доступа к калькулятору </template>
      <template #text> Пожалуйста, проверьте, что калькулятор запущен с бота </template>
    </message-page-layout>
  </div>
</template>

<script setup lang="ts">
import MessagePageLayout from '@app/views/MessagePageLayout.vue';
</script>

<style lang="scss" scoped>
.unauthorized-page {
  //
}
</style>
