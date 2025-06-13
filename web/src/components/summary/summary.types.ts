import { StepWithOptions } from '@app/stores/calculation/types';
import { SubStep } from '@/common/types';
import { AnswerType } from '@/common/types/calculator';

export type SummaryItemProps = {
  step: StepWithOptions | SubStep;
  answer: AnswerType | null;
  embedded?: boolean;
};
