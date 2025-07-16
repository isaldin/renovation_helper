import { inject, injectable } from 'tsyringe';
import { ServiceNames } from '@/common';
import { HttpService } from '@app/services/http.service';
import { TelegramWebAppService } from '@app/services/telegramWebApp.service';
import { RouterService } from '@app/services/routerService';
import { RouteNames } from '@app/router/routeNames';
import { BaseAuthService } from '@app/services/auth/auth.service.base';

@injectable()
export class AuthService implements BaseAuthService {
  constructor(
    @inject(ServiceNames.WAHttpService) protected readonly httpService: HttpService,
    @inject(ServiceNames.WATelegramWebAppService) protected readonly telegramWebAppService: TelegramWebAppService,
    @inject(ServiceNames.WARouterService) protected readonly routerService: RouterService
  ) {}

  public async authenticate(): Promise<void> {
    const initData = this.telegramWebAppService.getInitData();

    await this.httpService.post<void, { initData: string }>('/auth/verify', {
      initData,
    });
  }
  catch(error: unknown) {
    this.routerService.goTo(RouteNames.error);
    throw error;
  }
}
