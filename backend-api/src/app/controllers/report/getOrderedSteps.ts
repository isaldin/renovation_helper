import { isStepWithNextStep, Step, StepId } from '@common';

export const getOrderedSteps = (steps: Step[]): Step[] => {
  const stepsMap: Record<StepId, Step> = {};

  let stepIds = steps.map((step) => step.id);

  // remove all stepIds that other steps relate to
  steps.forEach((item) => {
    stepsMap[item.id] = item;

    if (!isStepWithNextStep(item)) {
      return;
    }
    stepIds = stepIds.filter((id) => id !== item.nextStep);
  });

  if (stepIds.length === 0) {
    return [];
  }

  const orderedSteps: Step[] = [];
  const firstStepId = stepIds[0];
  let currentStep = stepsMap[firstStepId];

  while (currentStep) {
    orderedSteps.push(currentStep);
    currentStep = stepsMap[isStepWithNextStep(currentStep) ? currentStep.nextStep : ''];
  }

  return orderedSteps;
};
