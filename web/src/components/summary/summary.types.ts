import { AnswerType, StepWithOptions } from '@app/stores/calculation/types';
import { SubStep } from '@/common/types';

export type SummaryItemProps = {
  step: StepWithOptions | SubStep;
  answer: AnswerType | null;
  embedded?: boolean;
};
