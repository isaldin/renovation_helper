<template>
  <div />
</template>

<script setup lang="ts">
import { getRouterService, getTelegramWebAppService } from '@app/container';
import { TelegramWebAppValues } from '@app/services/telegramWebApp.service.const';
import { RouteNames } from '@app/router/routeNames';

const calculatorId = getTelegramWebAppService().getValue(TelegramWebAppValues.calculatorId);
const companyId = getTelegramWebAppService().getValue(TelegramWebAppValues.companyId);

if (calculatorId && companyId) {
  getRouterService().goTo(RouteNames.calculation, { companyId, calculatorId });
}
</script>
