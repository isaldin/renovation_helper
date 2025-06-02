import { container, DependencyContainer } from 'tsyringe';
import { ServiceNames } from './serviceNames';
import { CalculatorRepository } from '../repository/calculator/calculator.repository';
import { CalculatorSettingsRepository } from '../repository/calculator/calculatorSettings.repository';
import { CalculatorStepsRepository } from '../repository/calculator/calculatorSteps.repository';
import { CalculatorOptionsRepository } from '../repository/calculator/calculatorOptions.repository';
import { CalculatorSettingsService } from '../services/calculator/calculatorSettings.service';
import { CalculatorService } from '../services/calculator/calculator.service';
import { CalculatorStepsService } from '../services/calculator/calculatorSteps.service';
import { CalculatorOptionsService } from '../services/calculator/calculatorOptionsService';
import { CalculatorSubStepsRepository } from '../repository/calculator/calculatorSubSteps.repository';
import { CalculatorSubStepsService } from '../services/calculator/calculatorSubSteps.service';

type RegisterServicesFn = (container: DependencyContainer) => void;

export const registerContainer = (registerServicesFn: RegisterServicesFn) => {
  registerServicesFn(container);

  container.registerSingleton<CalculatorRepository>(ServiceNames.CalculatorRepository, CalculatorRepository);
  container.registerSingleton<CalculatorSettingsRepository>(
    ServiceNames.CalculatorSettingsRepository,
    CalculatorSettingsRepository
  );
  container.registerSingleton<CalculatorStepsRepository>(
    ServiceNames.CalculatorStepsRepository,
    CalculatorStepsRepository
  );
  container.registerSingleton<CalculatorOptionsRepository>(
    ServiceNames.CalculatorOptionsRepository,
    CalculatorOptionsRepository
  );
  container.registerSingleton<CalculatorService>(ServiceNames.CalculatorService, CalculatorService);
  container.registerSingleton<CalculatorSettingsService>(
    ServiceNames.CalculatorSettingsService,
    CalculatorSettingsService
  );
  container.registerSingleton<CalculatorStepsRepository>(
    ServiceNames.CalculatorStepsRepository,
    CalculatorStepsRepository
  );
  container.registerSingleton<CalculatorStepsService>(ServiceNames.CalculatorStepsService, CalculatorStepsService);
  container.registerSingleton<CalculatorOptionsRepository>(
    ServiceNames.CalculatorOptionsRepository,
    CalculatorOptionsRepository
  );
  container.registerSingleton<CalculatorOptionsService>(
    ServiceNames.CalculatorOptionsService,
    CalculatorOptionsService
  );
  container.registerSingleton<CalculatorSubStepsRepository>(
    ServiceNames.CalculatorSubStepsRepository,
    CalculatorSubStepsRepository
  );
  container.registerSingleton<CalculatorSubStepsService>(
    ServiceNames.CalculatorSubStepsService,
    CalculatorSubStepsService
  );
};
