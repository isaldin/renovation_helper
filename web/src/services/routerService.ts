import { injectable } from 'tsyringe';
import { createRouter, createWebHistory, RouteParamsRawGeneric, Router } from 'vue-router';
import { RouteNames } from '@app/router/routeNames';
import { routes } from '@app/router/routes';

@injectable()
export class RouterService {
  private readonly _router: Router;

  constructor() {
    this._router = this.createRouter();
  }

  public get router(): Router {
    return this._router;
  }

  public getRouterParams(): Record<string, unknown> {
    return this.router.currentRoute.value.params || {};
  }

  public getCurrentRoute() {
    return this.router.currentRoute.value;
  }

  public goTo(routeName: RouteNames, params?: RouteParamsRawGeneric) {
    return this.router.push({ name: routeName, params });
  }

  private createRouter(): Router {
    return createRouter({
      history: createWebHistory(),
      routes,
    });
  }
}
