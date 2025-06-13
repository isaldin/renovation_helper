import { StepId } from '@/common/types';
import { AnswerType } from '@/common/types/calculator';

export type AnswersMap = Record<StepId, AnswerType | null>;

export type CalculationStepViewProps = {
  stepId: StepId;
  answersMap: AnswersMap;
  title: string;
};

export type CalculationStepViewEmits = {
  (e: 'update:answers-map', answersMap: AnswersMap): void;
};
