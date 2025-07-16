<template>
  <n-modal-provider>
    <router-view />
  </n-modal-provider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { NModalProvider } from 'naive-ui';
</script>
