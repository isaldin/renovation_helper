import { RouteRecordRaw } from 'vue-router';
import { RouteNames } from '@app/router/routeNames';
import HomeView from '@app/views/HomeView.vue';
import CalculationView from '@app/views/CalculationView.vue';
import { calculationGuard } from './guards/calculation.guard';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: RouteNames.index,
    component: HomeView,
  },
  {
    path: '/calculation/:calculatorId?',
    name: RouteNames.calculation,
    component: CalculationView,
    beforeEnter: calculationGuard,
  },
  {
    path: '/pages',
    children: [
      {
        path: 'unauth',
        name: RouteNames.unauth,
        component: () => import('../views/unauth-page/UnauthorizedPage.vue'),
      },
      {
        path: 'error',
        name: RouteNames.error,
        component: () => import('../views/error-page/ErrorPage.vue'),
      },
      {
        path: 'wait-report',
        name: RouteNames.waitReport,
        component: () => import('../views/wait-report-page/WaitReportPage.vue'),
      },
      {
        path: 'report-already-exists',
        name: RouteNames.reportAlreadyExists,
        component: () => import('../views/report-already-exists-page/ReportAlreadyExistsPage.vue'),
      },
    ],
  },
];
