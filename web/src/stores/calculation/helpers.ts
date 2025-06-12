import {
  OptionItem,
  OptionList,
  Step,
  StepWithOptionsFrom,
  SubStep,
  SubStepBoolean,
  SubStepWithOptionItems,
} from '@/common/types';
import { StepWithOptions } from '@app/stores/calculation/types';
import { hasField } from '@app/utils/hasField';

export const getFirstStep = (steps: Record<string, StepWithOptions>) => {
  const stepIds = Object.keys(steps);
  Object.values(steps).forEach((step) => {
    if (hasNextStep(step)) {
      stepIds.splice(stepIds.indexOf(step.nextStep), 1);
    }
  });

  return stepIds[0] ? steps[stepIds[0]] : null;
};

export const prepareSteps = (steps: Step[], optionList: OptionList[]): Record<string, StepWithOptions> => {
  return steps.reduce((acc: Record<Step['id'], StepWithOptions>, step: Step) => {
    acc[step.id] = {
      ...step,
      options: optionList.find((ol) => isStepWithOptionsFrom(step) && ol.id === step.optionsFrom)?.options || [],
      subSteps: [],
      defaultValue: isStepWithOptionsFrom(step) ? (step.defaultValue as string) : undefined,
    };
    return acc;
  }, {});
};

export const hasNextStep = (input: unknown) => hasField<'nextStep', Step['id']>(input, 'nextStep');

export const getNextStepId = (input: unknown): Step['id'] | null => {
  if (!hasNextStep(input)) {
    return null;
  }

  return input.nextStep || null;
};

export const isStepWithOptionsFrom = (input: unknown): input is StepWithOptionsFrom => {
  return hasField<'optionsFrom', string>(input, 'optionsFrom');
};

export const isStepWithOptions = (input: unknown): input is StepWithOptions => {
  return hasField<'options', OptionList['options']>(input, 'options');
};

export const isSubStepWithOptionItems = (input: unknown): input is SubStepWithOptionItems => {
  return hasField<'optionItems', string[]>(input, 'optionItems');
};

export const isSubStepEmbedded = (subStep: SubStep): boolean => {
  return Boolean(subStep.type === 'boolean' && (subStep as SubStepBoolean).embed);
};

export const getOptionItems = (step: StepWithOptions | SubStep): OptionItem[] => {
  if (isSubStepWithOptionItems(step)) {
    return step.optionItems;
  } else if (isStepWithOptions(step)) {
    return step.options;
  }
  return [];
};

export const getDefaultOptionId = (step: StepWithOptions | SubStep): OptionItem['id'] | null => {
  if (isSubStepWithOptionItems(step)) {
    if (typeof step.defaultValue === 'string') {
      return step.defaultValue;
    }

    return null;
  }
  if (!isStepWithOptions(step)) {
    return null;
  }

  return step.defaultValue || null;
};
