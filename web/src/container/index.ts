import { ServiceNames } from '@/common/di';
import { container } from 'tsyringe';
import { CalculatorService } from '@/common/services/calculator/calculator.service';
import { TelegramWebAppService } from '@app/services/telegramWebApp.service';
import { RouterService } from '@app/services/routerService';
import { CalculatorResultsService } from '@/common/services/calculatorResults/calculatorResults.service';

const get = <T>(name: ServiceNames) => container.resolve<T>(name) as T;

export const getCalculatorService = () => get<CalculatorService>(ServiceNames.CalculatorService);

export const getTelegramWebAppService = () => get<TelegramWebAppService>(ServiceNames.WATelegramWebAppService);

export const getRouterService = () => get<RouterService>(ServiceNames.WARouterService);

export const getCalculatorResultsService = () => get<CalculatorResultsService>(ServiceNames.CalculatorResultsService);
