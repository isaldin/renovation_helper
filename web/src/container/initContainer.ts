import { FirebaseServiceConfig, registerContainer, ServiceNames } from '@/common';
import { DependencyContainer } from 'tsyringe';
import { firebaseServiceConfig } from '@app/services/firebaseConfig.service';
import { TelegramWebAppService } from '@app/services/telegramWebApp.service';
import { HttpService } from '@app/services/http.service';
import { UnauthInterceptor } from '@app/services/interceptors/unauth.interceptor';
import { EnvironmentService } from '@app/services/environment.service';
import type { BaseAuthService } from '@app/services/auth/auth.service.base';
import { ClientFirebaseStore } from '@/common/repository/firebase/clientFirebaseStore';
import { FirebaseStore } from '@/common/repository/firebase/firebaseStore';
import { RouterService } from '@app/services/routerService';
import { AppInitService } from '@app/services/appInit.service';
import { getAuthServiceClass } from '@app/services/auth';
import { MeService } from '@app/services/me.service';
import { AppStateService } from '@app/services/appState.service';
import { HttpCalculationResultsService } from '@app/services/httpCalculationResults.service';

export const initContainer = async () => {
  const AuthService = await getAuthServiceClass();

  registerContainer((container: DependencyContainer) => {
    container.register<string>('BACKEND_BASE_URL', {
      useValue: import.meta.env.VITE_BACKEND_URL,
    });

    container.register<FirebaseServiceConfig>(ServiceNames.FirebaseClientConfigService, {
      useValue: firebaseServiceConfig,
    });
    container.registerSingleton<FirebaseStore>(ServiceNames.FirebaseStore, ClientFirebaseStore);

    container.registerSingleton<AppInitService>(ServiceNames.WAAppInitService, AppInitService);
    container.registerSingleton<RouterService>(ServiceNames.WARouterService, RouterService);
    container.registerSingleton<TelegramWebAppService>(ServiceNames.WATelegramWebAppService, TelegramWebAppService);
    container.registerSingleton<HttpService>(ServiceNames.WAHttpService, HttpService);
    container.registerSingleton<BaseAuthService>(ServiceNames.WAAuthService, AuthService);
    container.registerSingleton<EnvironmentService>(ServiceNames.WAEnvironmentService, EnvironmentService);
    container.registerSingleton<MeService>(ServiceNames.WAMeService, MeService);
    container.registerSingleton<AppStateService>(ServiceNames.WAAppStateService, AppStateService);
    container.registerSingleton<HttpCalculationResultsService>(
      ServiceNames.WAHttpCalculationResultsService,
      HttpCalculationResultsService
    );

    container.registerSingleton<UnauthInterceptor>(ServiceNames.WAUnauthInterceptor, UnauthInterceptor);
  });
};
