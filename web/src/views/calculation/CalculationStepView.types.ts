import { StepId } from '@/common/types';
import { AnswerType } from '@app/stores/calculation/types';

export type AnswersMap = Record<StepId, AnswerType | null>;

export type CalculationStepViewProps = {
  stepId: StepId;
  answersMap: AnswersMap;
  title: string;
};

export type CalculationStepViewEmits = {
  (e: 'update:answers-map', answersMap: AnswersMap): void;
};
