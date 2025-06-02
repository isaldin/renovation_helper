import { RouteRecordRaw } from 'vue-router';
import { RouteNames } from '@app/router/routeNames';
import HomeView from '@app/views/HomeView.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: RouteNames.index,
    component: HomeView,
  },
  {
    path: '/calculation/:companyId?/:calculatorId?',
    name: RouteNames.calculation,
    component: () => import('../views/CalculationView.vue'),
  },
];
