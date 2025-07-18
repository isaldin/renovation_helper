import { z } from 'zod';
import { optionItemSchema } from './options';
import { stepCommonSchema, stepIdSchema } from './steps';

export const subStepCommonSchema = stepCommonSchema.extend({
  sourceStepId: stepIdSchema,
  choiceFromSource: z.union([
    z.string(),
    z.array(z.string()),
    z.boolean(),
    //
  ]),
});
export type SubStepCommon = z.infer<typeof subStepCommonSchema>;

export const subStepCheckboxSchema = subStepCommonSchema.extend({
  type: z.literal('checkbox'),
  optionItems: z.array(optionItemSchema),
  multiple: z.boolean().optional(),
  defaultValue: z.union([z.string(), z.array(z.string())]).optional(),
});
export type SubStepCheckbox = z.infer<typeof subStepCheckboxSchema>;

export const subStepSelectSchema = subStepCommonSchema.extend({
  type: z.literal('select'),
  optionItems: z.array(optionItemSchema),
  multiple: z.boolean().optional(),
  defaultValue: z.union([z.string(), z.array(z.string())]).optional(),
});
export type SubStepSelect = z.infer<typeof subStepSelectSchema>;

export const isSubStepWithOptionItems = (input: SubStep): input is SubStepSelect | SubStepCheckbox => {
  return 'optionItems' in input && Array.isArray(input.optionItems);
};

export const subStepBooleanSchema = subStepCommonSchema.extend({
  type: z.literal('boolean'),
  embed: z.boolean().optional(),
});
export type SubStepBoolean = z.infer<typeof subStepBooleanSchema>;

export const subStepSchema = z.discriminatedUnion('type', [
  subStepCheckboxSchema,
  subStepSelectSchema,
  subStepBooleanSchema,
]);
export type SubStep = z.infer<typeof subStepSchema>;
