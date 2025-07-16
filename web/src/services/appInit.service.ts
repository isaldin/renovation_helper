import { ServiceNames } from '@/common/di';
import { inject, injectable } from 'tsyringe';
import type { BaseAuthService } from '@app/services/auth/auth.service.base';
import { MeService } from '@app/services/me.service';
import { AppStateService } from '@app/services/appState.service';
import { TelegramWebAppService } from '@app/services/telegramWebApp.service';
import { RouterService } from '@app/services/routerService';
import { RouteNames } from '@app/router/routeNames';

@injectable()
export class AppInitService {
  constructor(
    @inject(ServiceNames.WAAuthService) protected readonly authService: BaseAuthService,
    @inject(ServiceNames.WAMeService) protected readonly meService: MeService,
    @inject(ServiceNames.WAAppStateService) protected readonly appStateService: AppStateService,
    @inject(ServiceNames.WATelegramWebAppService) protected readonly telegramWebAppService: TelegramWebAppService,
    @inject(ServiceNames.WARouterService) protected readonly routerService: RouterService
  ) {}

  public async initializeApp(): Promise<void> {
    try {
      this.telegramWebAppService.expandApp();

      this.appStateService.setAppStatus('loading');

      await this.authService.authenticate();

      console.log('before initializeApp');
      const me = await this.meService.fetchMe();
      this.meService.setMe(me!);

      this.appStateService.setAppStatus('ready');
    } catch (error) {
      this.appStateService.setAppStatus('error');
      this.routerService.goTo(RouteNames.error);
    }
  }
}
