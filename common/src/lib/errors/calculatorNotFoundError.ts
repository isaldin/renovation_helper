import { EntityNotFoundError } from './entityNotFoundError';

export class CalculatorNotFoundError extends EntityNotFoundError {
  constructor(id: string) {
    super('Calculator with id ' + id);
    this.name = 'CalculatorNotFoundError';
  }
}
