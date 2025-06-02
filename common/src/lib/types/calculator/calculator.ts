import { CalculatorSettings } from './settings';
import { Step } from './steps';
import { OptionList } from './options';

export interface Calculator {
  id: string;
  version: string;
  companyId: string;
  settings: CalculatorSettings;
  steps: Step[];
  optionList: OptionList[];
}
