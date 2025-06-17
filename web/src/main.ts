import 'reflect-metadata';

import './styles.scss';
import { createApp } from 'vue';
import { registerContainer, ServiceNames } from '@/common';
import { container, DependencyContainer } from 'tsyringe';
import { firebaseServiceConfig } from './services/firebaseConfig.service';
import { FirebaseService, FirebaseServiceConfig } from '@/common/services';
import { AppInitService } from './services/appInit.service';
import { createPinia } from 'pinia';
import piniaPersistedState from 'pinia-plugin-persistedstate';
import { RouterService } from '@app/services/routerService';
import { TelegramWebAppService } from '@app/services/telegramWebApp.service';
import App from '@app/views/App.vue';

const startApp = async () => {
  registerContainer((container: DependencyContainer) => {
    container.register<FirebaseServiceConfig>(ServiceNames.WAFirebaseConfigService, {
      useValue: firebaseServiceConfig,
    });
    container.registerSingleton(ServiceNames.FirebaseService, FirebaseService);
    container.registerSingleton<AppInitService>(ServiceNames.WAAppInitService, AppInitService);
    container.registerSingleton<RouterService>(ServiceNames.WARouterService, RouterService);
    container.registerSingleton<TelegramWebAppService>(ServiceNames.WATelegramWebAppService, TelegramWebAppService);
  });

  const appInitService = container.resolve<AppInitService>(ServiceNames.WAAppInitService);
  const routerService = container.resolve<RouterService>(ServiceNames.WARouterService);

  await appInitService.initializeApp();

  const app = createApp(App);

  app.use(routerService.router);

  const pinia = createPinia();
  pinia.use(piniaPersistedState);
  app.use(pinia);

  app.mount('#root');
};

try {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  console.log(Telegram.WebApp);
} catch {
  //
}

startApp();
