import { OptionItem } from './options';
import { StepCommon } from './steps';

export type SubStep = SubStepWithOptionItems | SubStepBoolean;

export type SubStepCommon = StepCommon & {
  sourceStepId: string;
  choiceFromSource: string | string[] | boolean;
};

export type SubStepWithOptionItems = SubStepCommon & {
  type: 'checkbox' | 'select';
  optionItems: OptionItem[];
  multiple?: boolean;
  defaultValue?: string | string[];
};

export type SubStepBoolean = SubStepCommon & {
  type: 'boolean';
  embed?: boolean;
};
