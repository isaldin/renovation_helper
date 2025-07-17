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

const routerService = getRouterService();

const appStatus = computed(() => getAppStateService().appStatus());

watch(
  appStatus,
  (value) => {
    if (value === 'ready') {
      const me = getMeService().getMe()!;

      if (me.reportId) {
        routerService.goTo(RouteNames.reportAlreadyExists);
        return;
      }

      // Check if user was trying to access a specific calculation route
      const currentRoute = routerService.getCurrentRoute();
      const intendedCalculatorId = currentRoute.query.calculatorId as string;
      
      if (intendedCalculatorId) {
        // User was trying to access a specific calculation, redirect there
        routerService.goTo(RouteNames.calculation, { calculatorId: intendedCalculatorId });
      } else {
        // Default behavior - redirect to user's assigned calculator
        const calculatorId = me.calculatorId;
        console.log(Date.now(), 'Redirecting to calculator with ID:', calculatorId);
        routerService.goTo(RouteNames.calculation, { calculatorId });
      }
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
