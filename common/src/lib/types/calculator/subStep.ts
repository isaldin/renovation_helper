import { OptionItem } from './options';
import { StepType } from './steps';

export type SubStep = {
  id: string;
  sourceStepId: string;
  choiceFromSource: string | string[];
  title: string;
} & (
  | {
      optionItems: OptionItem[];
      type: Omit<StepType, 'calc' | 'boolean'>;
    }
  | {
      type: 'boolean';
    }
);
