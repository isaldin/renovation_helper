import { AxiosResponseInterceptor } from '@app/services/interceptors/types';
import { inject, injectable } from 'tsyringe';
import { AxiosError, AxiosResponse } from 'axios';
import { ServiceNames } from '@/common';
import { RouterService } from '@app/services/routerService';
import { RouteNames } from '@app/router/routeNames';

@injectable()
export class UnauthInterceptor implements AxiosResponseInterceptor {
  constructor(@inject(ServiceNames.WARouterService) protected readonly routerService: RouterService) {}

  public onFulfilled(response: AxiosResponse) {
    return response;
  }

  public onRejected(error: AxiosError) {
    console.error('Interceptor error:', error);
    console.error('Error code:', error.code);

    if (error.response?.status === 401) {
      this.routerService.goTo(RouteNames.unauth);
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
}
