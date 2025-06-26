import { z } from 'zod';
import { optionItemSchema } from './options';

export const stepIdSchema = z.string();
export type StepId = z.infer<typeof stepIdSchema>;

export const stepTypeSchema = z.enum([
  'select',
  'checkbox',
  'number',
  'boolean',
  'calc',
  //
]);
export type StepType = z.infer<typeof stepTypeSchema>;

export const stepCommonSchema = z.object({
  id: stepIdSchema,
  title: z.string(),
});
export type StepCommon = z.infer<typeof stepCommonSchema>;

export const stepWithNextStepSchema = stepCommonSchema.extend({
  nextStep: stepCommonSchema.shape.id,
});
export type StepWithNextStep = z.infer<typeof stepWithNextStepSchema>;

export const stepWithOptionsFromSchema = stepWithNextStepSchema.extend({
  type: z.enum(['select', 'checkbox']),
  optionsFrom: optionItemSchema.shape.id,
  multiple: z.boolean().optional(),
  defaultValue: z
    .union([
      z.string(),
      z.array(z.string()),
      //
    ])
    .optional(),
});
export type StepWithOptionsFrom = z.infer<typeof stepWithOptionsFromSchema>;

export const stepWithNumberSchema = stepWithNextStepSchema.extend({
  type: z.literal('number'),
});
export type StepWithNumber = z.infer<typeof stepWithNumberSchema>;

export const stepWithBooleanSchema = stepWithNextStepSchema.extend({
  type: z.literal('boolean'),
});
export type StepWithBoolean = z.infer<typeof stepWithBooleanSchema>;

export const stepCalcSchema = stepCommonSchema.extend({
  type: z.literal('calc'),
});
export type StepCalc = z.infer<typeof stepCalcSchema>;

export const stepSchema = z.discriminatedUnion('type', [
  stepWithOptionsFromSchema,
  stepWithBooleanSchema,
  stepWithNumberSchema,
  stepCalcSchema,
]);
export type Step = z.infer<typeof stepSchema>;
