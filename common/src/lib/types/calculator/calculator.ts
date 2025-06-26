import { z } from 'zod';
import { calculatorSettingsSchema } from './settings';
import { stepSchema } from './steps';
import { optionListSchema } from './options';
import { subStepSchema } from './subStep';

export const calculatorSchema = z.object({
  id: z.string(),
  version: z.string(),
  companyId: z.string(),
  settings: calculatorSettingsSchema,
  steps: z.array(stepSchema),
  subSteps: z.array(subStepSchema),
  optionList: z.array(optionListSchema),
});
export type Calculator = z.infer<typeof calculatorSchema>;
