<template>
  <div v-if="appStatus === 'loading'" class="flex justify-center align-middle hs-screen px-4">
    <n-spin size="large" />
  </div>
</template>

<script setup lang="ts">
import { getAppStateService, getMeService, getRouterService } from '@app/container';
import { RouteNames } from '@app/router/routeNames';
import { computed, watch } from 'vue';
import { NSpin } from 'naive-ui';

const appStatus = computed(() => getAppStateService().appStatus());

watch(
  appStatus,
  (value) => {
    if (value === 'ready') {
      const calculatorId = getMeService().getMe()!.calculatorId;
      console.log(Date.now(), 'Redirecting to calculator with ID:', calculatorId);
      getRouterService().goTo(RouteNames.calculation, { calculatorId });
    }
  },
  { immediate: true }
);
</script>

<style lang="scss">
.hs-screen {
  height: 100vh;
  height: 100dvh;
}
</style>
