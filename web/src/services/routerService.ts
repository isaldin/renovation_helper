import { injectable } from 'tsyringe';
import { createRouter, createWebHistory, RouteParamsRawGeneric, Router } from 'vue-router';
import { RouteNames } from '@app/router/routeNames';
import { routes } from '@app/router/routes';
import { useAppStore } from '@app/stores/app';

@injectable()
export class RouterService {
  private readonly _router: Router;

  constructor() {
    this._router = this.createRouter();
    this.setupGlobalGuards();
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

  private setupGlobalGuards(): void {
    this._router.beforeEach(async (to, from, next) => {
      const appStore = useAppStore();
      
      // Skip guard for home route since it handles loading state
      if (to.name === RouteNames.index) {
        next();
        return;
      }
      
      // Skip guard for error and unauth pages
      if (to.name === RouteNames.error || to.name === RouteNames.unauth) {
        next();
        return;
      }
      
      // Wait for app to be ready before allowing navigation to other routes
      if (appStore.status === 'loading') {
        // Preserve intended destination by passing calculatorId as query param
        if (to.name === RouteNames.calculation && to.params.calculatorId) {
          next({ 
            name: RouteNames.index, 
            query: { calculatorId: to.params.calculatorId as string } 
          });
        } else {
          next({ name: RouteNames.index });
        }
        return;
      }
      
      // App is ready, proceed with navigation
      next();
    });
  }
}
