import { ServiceNames } from '@/common/di';
import { container } from 'tsyringe';
import { CalculatorService } from '@/common/services/calculator/calculator.service';
import { RouterService } from '@app/services/routerService';
import { AppInitService } from '@app/services/appInit.service';
import { MeService } from '@app/services/me.service';
import { AppStateService } from '@app/services/appState.service';
import { HttpCalculationResultsService } from '@app/services/httpCalculationResults.service';

const get = <T>(name: ServiceNames) => container.resolve<T>(name) as T;

export const getCalculatorService = () => get<CalculatorService>(ServiceNames.CalculatorService);

export const getRouterService = () => get<RouterService>(ServiceNames.WARouterService);

export const getAppInitService = () => get<AppInitService>(ServiceNames.WAAppInitService);

export const getMeService = () => get<MeService>(ServiceNames.WAMeService);

export const getAppStateService = () => get<AppStateService>(ServiceNames.WAAppStateService);

export const getHttpCalculationResultsService = () =>
  get<HttpCalculationResultsService>(ServiceNames.WAHttpCalculationResultsService);
