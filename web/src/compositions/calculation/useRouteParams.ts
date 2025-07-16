import { computed, watchEffect } from 'vue';
import { getRouterService } from '@app/container';
import { RouteNames } from '@app/router/routeNames';

export const useRouteParams = () => {
  const routerService = getRouterService();

  const routerParams = computed(() => routerService.getRouterParams());
  const calculatorId = computed(() => routerParams.value['calculatorId']);

  watchEffect(() => {
    if (!calculatorId.value) {
      routerService.goTo(RouteNames.index);
    }
  });

  return {
    calculatorId,
  };
};
