import { injectable } from 'tsyringe';
import { createRouter, createWebHistory, RouteParamsRawGeneric, Router } from 'vue-router';
import { RouteNames } from '@app/router/routeNames';
import { routes } from '@app/router/routes';

@injectable()
export class RouterService {
  private _router: Router | null = null;

  public get router(): Router {
    if (!this._router) {
      this._router = this.createRouter();
    }

    return this._router;
  }

  public getRouterParams(): Record<string, unknown> {
    return this._router!.currentRoute.value.params || {};
  }

  public getCurrentRoute() {
    return this._router!.currentRoute.value;
  }

  public goTo(routeName: RouteNames, params?: RouteParamsRawGeneric) {
    this._router?.push({ name: routeName, params });
  }

  private createRouter(): Router {
    return createRouter({
      history: createWebHistory(),
      routes,
    });
  }
}
