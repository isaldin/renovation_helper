import 'reflect-metadata';

import './styles.scss';
import App from '@app/views/App.vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPersistedState from 'pinia-plugin-persistedstate';
import { getAppInitService, getRouterService } from '@app/container';
import { initContainer } from '@app/container/initContainer';

const startApp = async () => {
  await initContainer();

  const app = createApp(App);

  const routerService = getRouterService();
  app.use(routerService.router);

  const pinia = createPinia();
  pinia.use(piniaPersistedState);
  app.use(pinia);

  app.mount('#root');

  const appInitService = getAppInitService();
  await appInitService.initializeApp();
};

startApp();
