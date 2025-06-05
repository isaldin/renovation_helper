import { computed, watchEffect } from 'vue';
import { getRouterService } from '@app/container';
import { RouteNames } from '@app/router/routeNames';

export const useRouteParams = () => {
  const routerService = getRouterService();

  const routerParams = computed(() => routerService.getRouterParams());
  const stepId = computed(() => routerParams.value['stepId']);
  const subStepId = computed(() => routerParams.value['subStepId']);
  const companyId = computed(() => routerParams.value['companyId']);
  const calculatorId = computed(() => routerParams.value['calculatorId']);

  watchEffect(() => {
    if (!companyId.value || !calculatorId.value) {
      routerService.goTo(RouteNames.index);
    }
  });

  return {
    stepId,
    subStepId,
    companyId,
    calculatorId,
  };
};
