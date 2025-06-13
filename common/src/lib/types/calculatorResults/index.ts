import { AnswerType } from '../../types';

export type CalculatorResults = {
  id: string;
  calculatorId: string;
  userId: string;
  results: Record<string, AnswerType | null>;
  createdAt: string;
};
