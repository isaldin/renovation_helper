export interface CalculatorSettings {
  id: string;
  calculatorId: string;
  name: string;
  language: 'ru' | 'en' | 'kz';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
