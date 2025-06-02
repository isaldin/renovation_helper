import { EntityNotFoundError } from './entityNotFoundError';

export class CalculatorSettingsNotFoundError extends EntityNotFoundError {
  constructor() {
    super('CalculatorSettings');
    this.name = 'CalculatorSettingsNotFoundError';
  }
}
