import { EntityNotFoundError } from './entityNotFoundError';

export class CalculatorNotFoundError extends EntityNotFoundError {
  constructor() {
    super('Calculator');
    this.name = 'CalculatorNotFoundError';
  }
}
