import { OptionList } from './options';

export type StepId = string;

export type StepType = 'select' | 'checkbox' | 'number' | 'boolean' | 'calc';

export type StepCommon = {
  id: StepId;
  title: string;
};

type StepWithNextStep = StepCommon & { nextStep: StepCommon['id'] };

export type StepWithOptionsFrom = StepWithNextStep & {
  type: 'select' | 'checkbox';
  optionsFrom?: OptionList['id'];
  multiple?: boolean;
  defaultValue?: string | string[];
};

export type StepWithNumber = StepWithNextStep & { type: 'number' };

export type StepWithBoolean = StepWithNextStep & { type: 'boolean' };

type StepCalc = StepCommon & { type: 'calc' };

export type Step = StepWithOptionsFrom | StepWithBoolean | StepWithNumber | StepCalc;
