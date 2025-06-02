import { CalculatorSettings } from './settings';
import { Step } from './steps';
import { OptionList } from './options';
import { SubStep } from './subStep';

export interface Calculator {
  id: string;
  version: string;
  companyId: string;
  settings: CalculatorSettings;
  steps: Step[];
  subSteps: SubStep[];
  optionList: OptionList[];
}
