<template>
  <div />
</template>

<script setup lang="ts">
import { getRouterService, getTelegramWebAppService } from '@app/container';
import { telegramWebAppValues } from '@app/services/telegramWebApp.service.const';
import { RouteNames } from '@app/router/routeNames';

const calculatorId = getTelegramWebAppService().getValue(telegramWebAppValues.calculatorId);
const companyId = getTelegramWebAppService().getValue(telegramWebAppValues.companyId);

if (calculatorId && companyId) {
  getRouterService().goTo(RouteNames.calculation, { companyId, calculatorId });
}
</script>
