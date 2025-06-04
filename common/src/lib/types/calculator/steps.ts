import { OptionList } from './options';

export type StepType = 'select' | 'checkbox' | 'number' | 'boolean' | 'calc';

export type StepCommon = {
  id: string;
  title: string;
};

export type StepWithOptionsFrom = StepCommon & {
  type: 'select' | 'checkbox';
  optionsFrom?: OptionList['id'];
  nextStep: StepCommon['id'];
  multiple?: boolean;
  defaultValue?: string | string[];
};

export type StepWithBoolean = StepCommon & { type: 'boolean'; nextStep: Step['id'] };

type StepCalc = StepCommon & { type: 'calc' };

export type Step = StepWithOptionsFrom | StepWithBoolean | StepCalc;
